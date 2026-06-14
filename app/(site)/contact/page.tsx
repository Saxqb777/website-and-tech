import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Tell us where it hurts. A 20-minute intake conversation, free, no deck.",
};

export default function ContactPage() {
  return (
    <section className="relative min-h-screen bg-ink">
      <div className="px-5 sm:px-8 pt-28 sm:pt-40">
        <SectionHeader
          index="00"
          code="INTAKE"
          status={
            <span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle mr-2 animate-pulse" />
              Open
            </span>
          }
        >
          Four questions · one reply within a working day
        </SectionHeader>
      </div>

      <div className="px-5 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-10 md:col-start-3 mb-16">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper-muted mb-6">
              // start here
            </p>
            <h1 className="font-display text-[clamp(2.25rem,9vw,8rem)] leading-[0.9] tracking-[-0.035em] text-paper">
              Tell us where it{" "}
              <span className="italic">
                hurts<span className="not-italic text-accent">.</span>
              </span>
            </h1>
            <p className="mt-8 max-w-xl font-display text-lg prose-body leading-relaxed">
              Two sentences is plenty. The bottleneck, the cost, who feels it.
              We&rsquo;ll write back inside a working day with whether software
              is the right answer.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
