import { db } from "@/lib/db";

export type CaseStudy = Awaited<
  ReturnType<typeof db.caseStudy.findFirst>
> extends infer T
  ? T extends null
    ? never
    : T
  : never;

export async function listPublishedCaseStudies(limit?: number) {
  return db.caseStudy.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}
