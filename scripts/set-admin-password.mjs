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

// Read a masked password from the TTY. Uses raw mode so we get a key
// at a time and can echo "*" for each character without leaking the
// real keystrokes — and so the terminating Enter never ends up inside
// the password buffer.
function askHidden(question) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    if (!stdin.isTTY) {
      reject(new Error("No TTY — run this in an interactive terminal."));
      return;
    }

    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let buf = "";
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          stdin.removeListener("data", onData);
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write("\n");
          resolve(buf);
          return;
        }
        if (ch === "") {
          // Ctrl+C
          stdin.setRawMode(false);
          stdout.write("\n");
          process.exit(130);
        }
        if (ch === "" || ch === "\b") {
          if (buf.length > 0) {
            buf = buf.slice(0, -1);
            stdout.write("\b \b");
          }
          continue;
        }
        // ignore any other control characters
        if (ch < " " && ch !== "\t") continue;
        buf += ch;
        stdout.write("*");
      }
    };
    stdin.on("data", onData);
  });
}

function upsertEnvVar(content, key, value) {
  const line = `${key}='${value}'`;
  if (new RegExp(`^${key}=`, "m").test(content)) {
    return content.replace(new RegExp(`^${key}=.*$`, "m"), line);
  }
  return content.trimEnd() + "\n" + line + "\n";
}

async function main() {
  console.log("\n  OBLIQUE — set admin password");
  console.log("  ─────────────────────────────");
  console.log("  Writes ADMIN_PASSWORD_HASH + AUTH_SECRET into .env.\n");

  const pw = (await askHidden("  New password (≥ 10 chars): ")).trim();
  if (!pw || pw.length < 10) {
    console.error("\n  ✗ Password must be at least 10 characters.");
    process.exit(1);
  }
  const confirm = (await askHidden("  Confirm password:           ")).trim();
  if (pw !== confirm) {
    console.error("\n  ✗ Passwords did not match.");
    process.exit(1);
  }

  process.stdout.write("  Hashing…");
  const hash = await bcrypt.hash(pw, 12);
  process.stdout.write(" ✔\n");

  let env = readFileSync(envPath, "utf8");

  if (!/^AUTH_SECRET=.+/m.test(env)) {
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
