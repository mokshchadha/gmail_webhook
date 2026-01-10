import { getAuthUrl, setCredentials } from "./gmail";
import { createInterface } from "readline";

console.log("Authorize this app by visiting this url:", getAuthUrl());

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  await setCredentials(code);
  console.log("Token stored successfully! You can now run 'bun run dev'.");
  rl.close();
});
