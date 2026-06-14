"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Step = {
  index: string;
  duration: string;
  title: string;
  italic: string;
  body: string;
  schematic: string[];
};

const STEPS: Step[] = [
  {
    index: "01",
    duration: "72 hours",
    title: "We",
    italic: "understand you.",
    body: "Three days inside your operation. We watch the actual flow — the spreadsheet, the inbox, the meeting that exists because the system doesn't. We come out with a diagram of where the money is leaking and what software would actually move the number.",
    schematic: [
      "OBS · field study",
      "INT · staff interviews",
      "MAP · workflow graph",
      "OUT · friction report",
    ],
  },
  {
    index: "02",
    duration: "10 days",
    title: "We",
    italic: "create.",
    body: "Ten-day cycles. We design and build a working slice — not a deck, not a Figma frame. Real software, written in the actual stack, deployed to a real URL. The whole thing exists by the end of the cycle.",
    schematic: [
      "ARC · slim system design",
      "DSN · interface in code",
      "BLD · ten-day delivery",
      "QA · we test it ourselves",
    ],
  },
  {
    index: "03",
    duration: "the next morning",
    title: "We",
    italic: "show you.",
    body: "Working software in real hands. Used in the real workflow. Direction corrects against reality, not against last week's slide. We watch what survives contact with your team — and what doesn't.",
    schematic: [
      "USE · staff in the loop",
      "OBS · live usage signal",
      "FBK · what actually broke",
      "ADJ · scope corrections",
    ],
  },
  {
    index: "04",
    duration: "forever",
    title: "We bring it",
    italic: "to life.",
    body: "Deploy, instrument, iterate. The machinery starts saving hours a day, preventing a class of mistake, lifting a number that matters. You keep the source from day one. We're a co-pilot you can fire — and you measure exactly how much it paid for itself.",
    schematic: [
      "DEP · production deploy",
      "MON · live instrumentation",
      "MEA · before / after",
      "OWN · you keep the source",
    ],
  },
];

export function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start 75%", "end 35%"],
  });

  // Vertical progress line grows with the user
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative bg-ink">
      <div className="px-5 sm:px-8 pt-16 sm:pt-24">
        <SectionHeader index="01" code="PROCESS" status="4 stages · ~21 days">
          How an engagement actually runs
        </SectionHeader>
      </div>

      <div className="px-5 sm:px-8 py-16 sm:py-24">
        <div ref={wrap} className="relative">
          {/* Faint full-height rule */}
          <div className="absolute left-3 sm:left-6 top-3 bottom-3 w-px bg-rule" />
          {/* Accent progress line that fills as you scroll */}
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="absolute left-3 sm:left-6 top-3 bottom-3 w-px bg-accent will-change-transform"
          />

          <div>
            {STEPS.map((step, i) => (
              <ProcessStep
                key={step.index}
                step={step}
                last={i === STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, last }: { step: Step; last: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 35%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [16, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className={`relative pl-10 sm:pl-20 ${last ? "" : "pb-20 sm:pb-32"}`}
    >
      {/* Node dot on the progress line */}
      <span className="absolute left-3 sm:left-6 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-ink ring-2 ring-accent" />

      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {/* Step header — number + duration + title */}
        <div className="col-span-12 md:col-span-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper">
              Step {step.index}
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
              · {step.duration}
            </span>
          </div>
          <h3 className="mt-3 font-display text-[clamp(1.8rem,5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-paper max-w-[14ch]">
            {step.title}{" "}
            <span className="italic">
              {step.italic.replace(/\.$/, "")}
              <span className="not-italic text-accent">.</span>
            </span>
          </h3>
        </div>

        {/* Body */}
        <div className="col-span-12 md:col-span-4 self-end">
          <p className="font-display text-base sm:text-lg prose-body leading-relaxed">
            {step.body}
          </p>
        </div>

        {/* Schematic side panel */}
        <div className="col-span-12 md:col-span-3 self-end">
          <ul className="space-y-1.5 border-l border-dashed border-rule pl-4">
            {step.schematic.map((row) => (
              <li
                key={row}
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-paper-muted"
              >
                <span className="mr-2 text-paper-muted">●</span>
                {row}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
