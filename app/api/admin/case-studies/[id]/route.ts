import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

async function gate() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return null;
}

export async function PATCH(req: Request, { params }: Ctx) {
  const blocked = await gate();
  if (blocked) return blocked;
  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;

  const data: Record<string, unknown> = {};
  for (const key of [
    "slug",
    "title",
    "client",
    "summary",
    "outcomeKey",
    "outcomeUnit",
    "tags",
  ] as const) {
    if (typeof body[key] === "string") data[key] = (body[key] as string).trim();
  }
  if (typeof body.year === "number") data.year = body.year;
  if (typeof body.year === "string" && body.year)
    data.year = parseInt(body.year, 10);
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.order === "string") data.order = parseInt(body.order, 10);
  if (typeof body.published === "boolean") data.published = body.published;

  try {
    const study = await db.caseStudy.update({ where: { id }, data });
    return NextResponse.json({ ok: true, study });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const blocked = await gate();
  if (blocked) return blocked;
  const { id } = await params;
  try {
    await db.caseStudy.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
