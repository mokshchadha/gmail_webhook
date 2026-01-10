import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { db } from "./db";
import { ingestEmails, setCredentials } from "./gmail";
import { Layout, EmailRow } from "./templates";
import { BunFile } from "bun";

const app = new Elysia()
  .use(html())
  
  // Serve static styles
  .get("/styles.css", () => Bun.file("src/styles.css"))
  
  // Main UI
  .get("/", () => {
    const emails = db.query("SELECT * FROM emails ORDER BY ingestedAt DESC").all();
    const emailsHtml = emails.map(EmailRow).join("");
    return Layout(emailsHtml);
  })

  // OAuth Callback
  .get("/oauth2callback", async ({ query, set }) => {
    const code = query.code;
    if (code) {
      await setCredentials(code);
      set.redirect = "/";
      return "Authenticated! Redirecting...";
    }
    return "No code provided";
  })
  
  // Resolve Toggle
  .post("/emails/:id/resolve", ({ params }) => {
    const email = db.query("SELECT * FROM emails WHERE id = $id").get({ $id: params.id }) as any;
    if (!email) return "Not found";
    
    const newValue = email.resolved ? 0 : 1;
    db.query("UPDATE emails SET resolved = $resolved WHERE id = $id").run({
      $resolved: newValue,
      $id: params.id
    });
    
    const updatedEmail = { ...email, resolved: newValue };
    return EmailRow(updatedEmail);
  })
  
  // Partial list for refresh
  .get("/emails", () => {
     const emails = db.query("SELECT * FROM emails ORDER BY ingestedAt DESC").all();
     return emails.map(EmailRow).join("");
  })

  // Ingest Trigger
  .post("/ingest", async () => {
    const result = await ingestEmails();
    if (result.status === "auth_required") {
        return `
          <tr style="background: rgba(251, 191, 36, 0.1);">
            <td colspan="7" style="text-align: center; color: var(--warning);">
              Authentication required! 
              <a href="${result.authUrl}" target="_blank" style="color: var(--accent); font-weight: bold; text-decoration: underline;">
                Click here to Authorize with Google
              </a>
            </td>
          </tr>`;
    }
    
    // Return the full list again (simplest for now, though swapping just new ones is better, 
    // but we want to show sorting order correctly)
    const emails = db.query("SELECT * FROM emails ORDER BY ingestedAt DESC").all();
    return emails.map(EmailRow).join("");
  })
  
  .listen(3000);

// Background Polling (Every 1 minute)
setInterval(async () => {
  console.log("Running background email ingestion...");
  await ingestEmails();
}, 5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
