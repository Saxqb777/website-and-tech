import { NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }
  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as { password?: unknown }).password ?? "")
      : "";
  if (!password) {
    return NextResponse.json(
      { ok: false, error: "Password required" },
      { status: 400 },
    );
  }
  const result = await loginWithPassword(password);
  if (!result.ok) {
    // small delay to dampen brute force attempts
    await new Promise((r) => setTimeout(r, 350));
    return NextResponse.json(
      { ok: false, error: result.error ?? "Login failed" },
      { status: 401 },
    );
  }
  return NextResponse.json({ ok: true });
}
