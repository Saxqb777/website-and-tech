#!/usr/bin/env node
/**
 * Interactive script: prompts for an admin password, hashes it with bcrypt,
 * and writes ADMIN_PASSWORD_HASH + AUTH_SECRET into the local .env file.
 *
 * Run: npm run admin:set-password
 *
 * Nothing is logged. The plaintext password never leaves this process.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (!existsSync(envPath) && existsSync(examplePath)) {
  copyFileSync(examplePath, envPath);
}
if (!existsSync(envPath)) {
  writeFileSync(envPath, "");
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    process.stdout.write(question);
    // mask the typed characters with *
    const stdin = process.stdin;
    let buffer = "";
    const onData = (ch) => {
      ch = ch.toString();
      if (ch === "\n" || ch === "\r" || ch === "") {
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        rl.close();
        resolve(buffer);
        return;
      }
      if (ch === "") {
        // Ctrl+C
        process.exit(1);
      }
      if (ch === "") {
        // backspace
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }
      buffer += ch;
      process.stdout.write("*");
    };
    stdin.on("data", onData);
  });
}

function upsertEnvVar(content, key, value) {
  const line = `${key}='${value}'`;
  if (content.match(new RegExp(`^${key}=`, "m"))) {
    return content.replace(new RegExp(`^${key}=.*$`, "m"), line);
  }
  return content.trimEnd() + "\n" + line + "\n";
}

async function main() {
  console.log("\n  OBLIQUE — set admin password");
  console.log("  ─────────────────────────────");
  console.log("  This sets ADMIN_PASSWORD_HASH and AUTH_SECRET in .env.\n");

  const pw = await askHidden("  New password (≥ 10 chars): ");
  if (!pw || pw.length < 10) {
    console.error("\n  ✗ Password must be at least 10 characters.");
    process.exit(1);
  }
  const confirm = await askHidden("  Confirm password:           ");
  if (pw !== confirm) {
    console.error("\n  ✗ Passwords did not match.");
    process.exit(1);
  }

  process.stdout.write("\n  Hashing…");
  const hash = await bcrypt.hash(pw, 12);
  process.stdout.write(" ✔\n");

  let env = readFileSync(envPath, "utf8");

  // Generate (or preserve) AUTH_SECRET
  const hasSecret = /^AUTH_SECRET=/m.test(env);
  if (!hasSecret) {
    const secret = crypto.randomBytes(48).toString("hex");
    env = upsertEnvVar(env, "AUTH_SECRET", secret);
    console.log("  ✔ Generated AUTH_SECRET");
  } else {
    console.log("  → AUTH_SECRET already present, leaving as-is");
  }

  env = upsertEnvVar(env, "ADMIN_PASSWORD_HASH", hash);
  writeFileSync(envPath, env);
  console.log("  ✔ Wrote ADMIN_PASSWORD_HASH to .env");
  console.log("\n  Restart `npm run dev` and visit /admin/login.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
