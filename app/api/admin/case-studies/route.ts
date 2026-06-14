import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

async function gate() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return null;
}

type Input = {
  slug?: string;
  title?: string;
  client?: string;
  year?: number | string;
  summary?: string;
  outcomeKey?: string;
  outcomeUnit?: string;
  tags?: string;
  order?: number | string;
  published?: boolean;
};

function normalize(input: Input) {
  const errors: Record<string, string> = {};
  const slug = String(input.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  const title = String(input.title ?? "").trim();
  const client = String(input.client ?? "").trim();
  const yearNum =
    typeof input.year === "number" ? input.year : parseInt(String(input.year ?? ""), 10);
  const summary = String(input.summary ?? "").trim();
  const outcomeKey = String(input.outcomeKey ?? "").trim();
  const outcomeUnit = String(input.outcomeUnit ?? "").trim();
  const tags = String(input.tags ?? "").trim();
  const orderNum =
    typeof input.order === "number" ? input.order : parseInt(String(input.order ?? "0"), 10);
  const published = input.published !== false;

  if (!slug) errors.slug = "Slug required";
  if (!title) errors.title = "Title required";
  if (!client) errors.client = "Client required";
  if (!Number.isFinite(yearNum) || yearNum < 1990 || yearNum > 2100)
    errors.year = "Year must be a four-digit number";
  if (!summary) errors.summary = "Summary required";
  if (!outcomeKey) errors.outcomeKey = "Outcome metric required";
  if (!outcomeUnit) errors.outcomeUnit = "Outcome unit required";

  if (Object.keys(errors).length) return { errors };
  return {
    data: {
      slug,
      title,
      client,
      year: yearNum,
      summary,
      outcomeKey,
      outcomeUnit,
      tags,
      order: Number.isFinite(orderNum) ? orderNum : 0,
      published,
    },
  };
}

export async function GET() {
  const blocked = await gate();
  if (blocked) return blocked;
  const studies = await db.caseStudy.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, studies });
}

export async function POST(req: Request) {
  const blocked = await gate();
  if (blocked) return blocked;
  const body = (await req.json()) as Input;
  const { data, errors } = normalize(body);
  if (!data) return NextResponse.json({ ok: false, errors }, { status: 400 });
  try {
    const created = await db.caseStudy.create({ data });
    return NextResponse.json({ ok: true, study: created });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
