import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const COOKIE = "oblique_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET missing or too short. Run `npm run admin:set-password`.",
    );
  }
  return s;
}

function sign(payload: string): string {
  const h = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${h}`;
}

function verify(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", getSecret())
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

export async function loginWithPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    throw new Error(
      "ADMIN_PASSWORD_HASH not set. Run `npm run admin:set-password`.",
    );
  }
  const ok = await bcrypt.compare(password, hash);
  if (!ok) return false;
  const payload = Buffer.from(
    JSON.stringify({
      sub: "admin",
      exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
    }),
  ).toString("base64url");
  const token = sign(payload);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function logout(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const t = c.get(COOKIE)?.value;
  if (!t) return false;
  try {
    return verify(t);
  } catch {
    return false;
  }
}
