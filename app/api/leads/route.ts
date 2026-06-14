import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(body: unknown): {
  data?: { name: string; email: string; company: string; message: string };
  errors?: ValidationErrors;
} {
  if (!body || typeof body !== "object") {
    return { errors: { name: "Invalid request body" } };
  }
  const b = body as Record<string, unknown>;
  const errors: ValidationErrors = {};
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const company = typeof b.company === "string" ? b.company.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";
  if (message.length < 12) errors.message = "Give us a bit more to go on.";

  if (Object.keys(errors).length > 0) return { errors };
  return { data: { name, email, company, message } };
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { message: "Invalid JSON" } },
      { status: 400 },
    );
  }

  const { data, errors } = validate(json);
  if (!data) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const lead = await db.lead.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company || null,
      message: data.message,
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, id: lead.id });
}
