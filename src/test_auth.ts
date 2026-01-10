import { BunFile } from "bun";

const TOKEN_PATH = "token.json";

async function check() {
  const file = Bun.file(TOKEN_PATH);
  if (await file.exists()) {
    const content = await file.json();
    console.log("Found token.json. Keys:", Object.keys(content));
    if (content.web || content.installed) {
        console.log("❌ ERROR: This looks like a Client Secret file, NOT a User Token.");
        console.log("You should NOT manually create token.json with client secrets.");
        console.log("Please delete this file and let the app generate it via the login flow.");
    } else if (content.access_token) {
        console.log("✅ Looks like a valid token file.");
    } else {
        console.log("❓ Unknown file format.");
    }
  } else {
    console.log("ℹ️ No token.json found. You need to authenticate.");
  }
}

check();
