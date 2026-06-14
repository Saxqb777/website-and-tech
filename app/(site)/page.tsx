import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { Proof } from "@/components/sections/Proof";
import { Approach } from "@/components/sections/Approach";
import { Cta } from "@/components/sections/Cta";

// Render on demand. Proof reads case studies from the DB, which
// shouldn't be a build-time dependency on platforms like Railway.
export const dynamic = "force-dynamic";

/**
 * The home page. One dense vertical journey — hero -> what we do (with
 * a horizontal-scroll stage) -> proof -> approach -> CTA -> footer.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <Proof />
      <Approach />
      <Cta />
    </>
  );
}
