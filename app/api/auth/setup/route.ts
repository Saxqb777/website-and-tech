import { NextResponse } from "next/server";
import { isPasswordConfigured, setPasswordAndLogin } from "@/lib/auth";

/**
 * First-time admin password creation. Returns 409 if a password has
 * already been set — there is no "reset password" endpoint here.
 */
export async function POST(req: Request) {
  if (await isPasswordConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Password is already set." },
      { status: 409 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  const password = String(
    (body as { password?: unknown })?.password ?? "",
  );
  const confirm = String(
    (body as { confirm?: unknown })?.confirm ?? "",
  );

  if (!password || !confirm) {
    return NextResponse.json(
      { ok: false, error: "Both fields required." },
      { status: 400 },
    );
  }
  if (password !== confirm) {
    return NextResponse.json(
      { ok: false, error: "Passwords don't match." },
      { status: 400 },
    );
  }

  const result = await setPasswordAndLogin(password);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Setup failed" },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true });
}
