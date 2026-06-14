import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const studies = [
  {
    slug: "midlands-logistics-routing",
    title: "From three spreadsheets to one routing engine.",
    client: "Midlands Logistics Co.",
    year: 2026,
    summary:
      "A regional carrier was rebuilding its daily run plan by hand every morning. We replaced the choreography with a routing engine that fed straight into their existing dispatch screens — no retraining, no new logins.",
    outcomeKey: "4.6h",
    outcomeUnit: "saved per morning",
    tags: "ops,logistics,routing,internal-tool",
    order: 1,
  },
  {
    slug: "northkraft-quoting-portal",
    title: "Killing the quote bottleneck inside a 40-year-old contractor.",
    client: "Northkraft Industrial",
    year: 2025,
    summary:
      "Quotes lived inside one person's inbox. We built a structured intake + pricing layer that pushes drafts to the team in minutes instead of days — and a customer-facing portal on top of the same data.",
    outcomeKey: "12×",
    outcomeUnit: "faster quote turnaround",
    tags: "b2b,portal,workflow,internal+external",
    order: 2,
  },
];

async function main() {
  for (const s of studies) {
    await db.caseStudy.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`[seed] upserted ${studies.length} case studies`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
