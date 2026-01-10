import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { db } from "./db";
import { BunFile } from "bun";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "token.json";

// You should get these from your Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/oauth2callback";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn("WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set in .env");
}

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

async function loadToken() {
  const file = Bun.file(TOKEN_PATH);
  if (await file.exists()) {
    const token = await file.json();
    oAuth2Client.setCredentials(token);
    return true;
  }
  return false;
}

async function saveToken(tokens: any) {
  await Bun.write(TOKEN_PATH, JSON.stringify(tokens));
  console.log("Token stored to", TOKEN_PATH);
}

export function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

export async function setCredentials(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  await saveToken(tokens);
}

// Simple categorization logic
function categorize(subject: string, sender: string, snippet: string): { category: string; priority: string } {
  const lowerSubject = subject.toLowerCase();
  const lowerSender = sender.toLowerCase();
  
  if (lowerSubject.includes("urgent") || lowerSubject.includes("alert")) {
    return { category: "Work", priority: "High" };
  }
  if (lowerSender.includes("newsletter") || lowerSubject.includes("unsubscribe")) {
    return { category: "Promotions", priority: "Low" };
  }
  if (lowerSender.includes("linkedin") || lowerSender.includes("github")) {
    return { category: "Social", priority: "Medium" };
  }
  
  return { category: "Personal", priority: "Normal" };
}

async function extractInfoWithGemini(subject: string, body: string, sender: string) {
    if (!GEMINI_API_KEY) return null;

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
            Extract the following information from this email:
            - orderNo (string, null if not found)
            - propertyAddress (string, null if not found)
            - quote_request (boolean, true if the user is asking for a price or quote)
            - summary (string, 1 line summary of the email content)
            - priority (string, one of: High, Medium, Low - base this on the tone and urgency of the email)

            Email Subject: ${subject}
            Sender: ${sender}
            Body/Snippet: ${body}
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini extraction failed:", error);
        return null;
    }
}

export async function ingestEmails() {
    const isAuthed = await loadToken();
    if (!isAuthed) {
        console.log("Not authenticated. Please visit:", getAuthUrl());
        return { status: "auth_required", authUrl: getAuthUrl() };
    }

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    
    try {
        const res = await gmail.users.messages.list({
            userId: "me",
            maxResults: 5,
        });

        const messages = res.data.messages;
        if (!messages || messages.length === 0) {
            console.log("No new messages.");
            return { status: "success", count: 0 };
        }

        let count = 0;
        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO emails (id, threadId, snippet, sender, recipient, subject, priority, category, link, orderNo, address, quoteRequest, aiSummary)
            VALUES ($id, $threadId, $snippet, $sender, $recipient, $subject, $priority, $category, $link, $orderNo, $address, $quoteRequest, $aiSummary)
        `);
        
        // Prepare a statement to check existence
        const checkStmt = db.prepare("SELECT 1 FROM emails WHERE id = ?");

        for (const msg of messages) {
            if (!msg.id) continue;
            
            // Check if email already exists
            const exists = checkStmt.get(msg.id);
            if (exists) {
                console.log(`Skipping existing email ID: ${msg.id}`);
                continue; 
            }

            const details = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full",
            });

            const headers = details.data.payload?.headers;
            const subject = headers?.find((h) => h.name === "Subject")?.value || "(No Subject)";
            const from = headers?.find((h) => h.name === "From")?.value || "";
            const to = headers?.find((h) => h.name === "To")?.value || "";
            const snippet = details.data.snippet || "";
            
            let { category, priority } = categorize(subject, from, snippet);
            const link = `https://mail.google.com/mail/u/0/#inbox/${msg.id}`;

            let orderNo = null;
            let address = null;
            let quoteRequest = false;
            let aiSummary = null;

            // Use Gemini if available
            if (GEMINI_API_KEY) {
                console.log(`Analyzing email ${msg.id} with Gemini...`);
                // Get full body if possible, defaulting to snippet for now to save complexity on multipart parsing
                // ideally we parse payload.parts but snippet is often enough for simple extraction
                const aiData = await extractInfoWithGemini(subject, snippet, from);
                
                if (aiData) {
                    if (aiData.orderNo) orderNo = aiData.orderNo;
                    if (aiData.propertyAddress) address = aiData.propertyAddress;
                    if (aiData.quote_request !== undefined) quoteRequest = aiData.quote_request;
                    if (aiData.summary) aiSummary = aiData.summary;
                    // Override priority if AI is confident? Or just trust AI
                    if (aiData.priority) priority = aiData.priority;
                }
            }

            insertStmt.run({
                $id: msg.id,
                $threadId: msg.threadId || null,
                $snippet: snippet,
                $sender: from,
                $recipient: to,
                $subject: subject,
                $priority: priority,
                $category: category,
                $link: link,
                $orderNo: orderNo,
                $address: address,
                $quoteRequest: quoteRequest ? 1 : 0,
                $aiSummary: aiSummary
            });
            count++;
        }
        
        if (count > 0) {
            console.log(`Ingested ${count} new emails.`);
        } else {
             console.log("No new emails to ingest.");
        }
        return { status: "success", count };

    } catch (error) {
        console.error("The API returned an error: " + error);
        return { status: "error", error };
    }
}
