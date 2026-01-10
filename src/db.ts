import { Database } from "bun:sqlite";

const db = new Database("emails.sqlite");

// Enable WAL for better concurrency (optional but good practice)
db.run("PRAGMA journal_mode = WAL;");

// Initialize Schema
db.run(`
  CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      threadId TEXT,
      snippet TEXT,
      sender TEXT, 
      recipient TEXT,
      subject TEXT,
      priority TEXT,
      category TEXT,
      link TEXT,
      resolved BOOLEAN DEFAULT 0,
      ingestedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("Database initialized.");

export { db };
