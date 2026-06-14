import { db } from "@/lib/db";

export type CaseStudy = Awaited<
  ReturnType<typeof db.caseStudy.findFirst>
> extends infer T
  ? T extends null
    ? never
    : T
  : never;

/**
 * Returns published case studies, ordered by `order` then recency.
 * If the DB isn't reachable (e.g. during a platform build before
 * migrations run), this returns an empty array instead of throwing
 * so pages still render.
 */
export async function listPublishedCaseStudies(limit?: number) {
  try {
    return await db.caseStudy.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  } catch (err) {
    console.error("[case-studies] DB unavailable, returning empty list:", err);
    return [];
  }
}
