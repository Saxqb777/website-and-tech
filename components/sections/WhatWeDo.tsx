"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Stage = {
  index: string;
  eyebrow: string;
  headline: string;
  italic?: string;
  body: string;
  metric: string;
  metricLabel: string;
  schematic: string[];
};

const STAGES: Stage[] = [
  {
    index: "S–01",
    eyebrow: "Find",
    headline: "We map the part of the business",
    italic: "nobody talks about.",
    body: "Three days inside your operation. We watch the actual flow — the spreadsheet, the inbox, the meeting that exists because the system doesn't. We come out with a diagram of where the money is leaking.",
    metric: "72h",
    metricLabel: "discovery sprint",
    schematic: [
      "OBS · field study",
      "INT · interview matrix",
      "MAP · workflow graph",
      "OUT · friction report",
    ],
  },
  {
    index: "S–02",
    eyebrow: "Build",
    headline: "We build the machinery —",
    italic: "fast, small, real.",
    body: "Ten-day cycles. Working software in your hands at the end of each one, used by real people in the real workflow. No PowerPoint, no four-month spec, no surprise final invoice.",
    metric: "10d",
    metricLabel: "shipping cycles",
    schematic: [
      "ARC · slim system design",
      "SHP · ten-day delivery",
      "USE · staff in the loop",
      "ITR · weekly iteration",
    ],
  },
  {
    index: "S–03",
    eyebrow: "Compound",
    headline: "Then it",
    italic: "pays for itself.",
    body: "The machinery doesn't sit in a release notes folder. It saves hours a day, prevents a class of mistake, lifts a number that matters. We instrument it so the value is visible — and so the next thing we build is the one that pays best.",
    metric: "∞",
    metricLabel: "per shipped unit",
    schematic: [
      "MON · live instrumentation",
      "MEA · before / after",
      "NXT · the next bottleneck",
      "OWN · you keep the source",
    ],
  },
];

export function WhatWeDo() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  // 3 panels => translate from 0% to -200% (i.e. 2 panel widths).
  // We finish the translate at 88% of the scroll, then hold flat to 100%
  // so the user actually sees the third panel sitting still before the
  // section unpins (previously they hit the same instant and the third
  // panel got clipped at the right).
  const x = useTransform(
    scrollYProgress,
    [0, 0.88, 1],
    ["0%", "-66.6666%", "-66.6666%"],
  );

  return (
    <>
      {/* Desktop: pinned section with horizontal scroll across 3 panels */}
      <section
        ref={wrap}
        className="relative bg-ink hidden md:block"
        style={{ height: "360vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="px-8 pt-24 pb-4">
            <SectionHeader index="01" code="WHAT.WE.DO" status="3 stages">
              Horizontal scroll · scroll to advance
            </SectionHeader>
          </div>

          <motion.div
            style={{ x }}
            className="flex h-[calc(100vh-7.5rem)] will-change-transform"
          >
            {STAGES.map((s) => (
              <StagePanel key={s.index} stage={s} />
            ))}
          </motion.div>

          {/* HUD bar */}
          <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
            <span>
              <span className="text-paper">Find</span>
              <span className="mx-3 text-paper-muted">→</span>
              <span className="text-paper">Build</span>
              <span className="mx-3 text-paper-muted">→</span>
              <span className="text-paper">Compound</span>
            </span>
            <ProgressIndicator progress={scrollYProgress} />
          </div>
        </div>
      </section>

      {/* Mobile: same three stages, stacked vertically — no pinning */}
      <section className="relative bg-ink block md:hidden">
        <div className="px-6 pt-20">
          <SectionHeader index="01" code="WHAT.WE.DO" status="3 stages">
            Find · Build · Compound
          </SectionHeader>
        </div>
        <div className="px-6 py-16 space-y-24">
          {STAGES.map((s) => (
            <article
              key={s.index}
              className="border-t border-dashed border-rule pt-10"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                  STAGE · {s.index}
                </p>
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
                  {s.eyebrow}
                </p>
              </div>
              <h3 className="mt-6 font-display text-[clamp(2.2rem,9vw,3.5rem)] leading-[0.95] tracking-[-0.03em] text-paper">
                {s.headline}{" "}
                {s.italic ? (
                  <span className="italic text-paper">{s.italic}</span>
                ) : null}
              </h3>
              <p className="mt-6 font-display text-base prose-body leading-relaxed">
                {s.body}
              </p>
              <div className="mt-8 flex items-end gap-8 border-t border-dashed border-rule pt-5">
                <div>
                  <div className="font-display text-4xl text-accent leading-none">
                    {s.metric}
                  </div>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                    {s.metricLabel}
                  </div>
                </div>
              </div>
              <ul className="mt-8 space-y-1.5">
                {s.schematic.map((row) => (
                  <li
                    key={row}
                    className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper-muted"
                  >
                    <span className="mr-3 text-paper-muted">●</span>
                    {row}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function StagePanel({ stage }: { stage: Stage }) {
  return (
    <div className="relative h-full w-screen shrink-0 px-8 md:px-16 flex items-center">
      <div className="grid grid-cols-12 gap-8 w-full">
        {/* Left: schematic side panel */}
        <div className="col-span-12 md:col-span-3 self-start">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-3">
            STAGE · {stage.index}
          </p>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent mb-8">
            {stage.eyebrow}
          </p>
          <ul className="space-y-2">
            {stage.schematic.map((row) => (
              <li
                key={row}
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper-muted"
              >
                <span className="mr-3 text-paper-muted">●</span>
                {row}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: the headline + body + metric */}
        <div className="col-span-12 md:col-span-9">
          <h3 className="font-display text-[clamp(2.8rem,6.5vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-paper max-w-[18ch]">
            {stage.headline}{" "}
            {stage.italic ? (
              <span className="italic text-paper">
                {stage.italic}
              </span>
            ) : null}
          </h3>
          <p className="mt-10 max-w-xl font-display text-lg prose-body leading-relaxed">
            {stage.body}
          </p>
          <div className="mt-12 flex items-end gap-8 border-t border-dashed border-rule pt-6">
            <div>
              <div className="font-display text-5xl text-accent leading-none">
                {stage.metric}
              </div>
              <div className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted">
                {stage.metricLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressIndicator({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const w = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <span className="flex items-center gap-3">
      <span className="text-paper-muted">Progress</span>
      <span className="relative block h-px w-32 bg-rule overflow-hidden">
        <motion.span
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: w }}
        />
      </span>
    </span>
  );
}
