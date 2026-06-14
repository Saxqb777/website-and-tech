import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE = "oblique_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
const KEY_HASH = "admin_password_hash";
const KEY_SECRET = "auth_secret";

// In-process cache so we don't hit the DB on every cookie verify.
// Cleared automatically when the module reloads in dev.
let secretCache: string | null = null;

async function getSetting(key: string): Promise<string | null> {
  const row = await db.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}

async function setSetting(key: string, value: string): Promise<void> {
  await db.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function getOrCreateSecret(): Promise<string> {
  if (secretCache) return secretCache;
  let s = await getSetting(KEY_SECRET);
  if (!s) {
    s = crypto.randomBytes(48).toString("hex");
    await setSetting(KEY_SECRET, s);
  }
  secretCache = s;
  return s;
}

function sign(payload: string, secret: string): string {
  const h = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${h}`;
}

function verify(token: string, secret: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return false;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof parsed.exp !== "number") return false;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return false;
    return parsed.sub === "admin";
  } catch {
    return false;
  }
}

async function issueSession(): Promise<void> {
  const secret = await getOrCreateSecret();
  const payload = Buffer.from(
    JSON.stringify({
      sub: "admin",
      exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
    }),
  ).toString("base64url");
  const token = sign(payload, secret);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** True only when an admin password hash exists in the DB. */
export async function isPasswordConfigured(): Promise<boolean> {
  return !!(await getSetting(KEY_HASH));
}

/**
 * First-time setup. Stores the bcrypt hash and immediately issues
 * a session for the caller. No-ops if a password is already set.
 */
export async function setPasswordAndLogin(password: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (password.length < 10) {
    return { ok: false, error: "Password must be at least 10 characters." };
  }
  if (await isPasswordConfigured()) {
    return { ok: false, error: "Password is already set." };
  }
  const hash = await bcrypt.hash(password, 12);
  await setSetting(KEY_HASH, hash);
  await issueSession();
  return { ok: true };
}

export async function loginWithPassword(password: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const hash = await getSetting(KEY_HASH);
  if (!hash) {
    return { ok: false, error: "Password not set yet." };
  }
  const ok = await bcrypt.compare(password, hash);
  if (!ok) return { ok: false, error: "Wrong password" };
  await issueSession();
  return { ok: true };
}

export async function logout(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const t = c.get(COOKIE)?.value;
  if (!t) return false;
  try {
    const secret = await getOrCreateSecret();
    return verify(t, secret);
  } catch {
    return false;
  }
}
