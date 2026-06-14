import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// One-time cleanup of placeholder seeds shipped before real case studies
// arrived. Safe to remove from this file once the DB no longer contains
// them; kept here so the next `npm install` wipes the old placeholders
// off the public site automatically.
const OBSOLETE_SLUGS = [
  "midlands-logistics-routing",
  "northkraft-quoting-portal",
];

const studies = [
  {
    slug: "sparezy-uae-auto-parts",
    title: "We disguised the lead form as the buy button.",
    client: "Sparezy",
    year: 2025,
    summary:
      "Sparezy needed every visitor to become a WhatsApp conversation, not an unanswered form. We built a single-page site that reads like a clean product page — customers configure their parts list against their VIN and 'check out' for AED 0.00 — and the order quietly drops a fully-formatted lead into the shop's WhatsApp the moment it's placed. Paired with a real-time kanban admin so sourcing, quoting, and closing all run from one screen.",
    outcomeKey: "1-tap",
    outcomeUnit: "order → WhatsApp lead",
    tags: "auto-parts, lead-capture, whatsapp, kanban-admin, single-page",
    order: 1,
  },
  {
    slug: "doc-ledger-ai-expense-platform",
    title: "We taught the ledger to read its own receipts.",
    client: "Doc Ledger",
    year: 2025,
    summary:
      "Doc Ledger replaces the spreadsheet-and-shoebox half of expense management. Staff snap a receipt or upload a PDF and a vision-AI pipeline extracts vendor, amount, date, and the expense-specific fields straight into a multi-tenant ledger — with multi-currency, isolated org branding, branded Excel exports, and a superadmin console sitting above every tenant.",
    outcomeKey: "1 photo",
    outcomeUnit: "receipt → ledger row",
    tags: "saas, multi-tenant, ai-extraction, vision-ai, finance-ops",
    order: 2,
  },
];

async function main() {
  const removed = await db.caseStudy.deleteMany({
    where: { slug: { in: OBSOLETE_SLUGS } },
  });

  for (const s of studies) {
    await db.caseStudy.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  console.log(
    `[seed] upserted ${studies.length} case studies, removed ${removed.count} obsolete`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
