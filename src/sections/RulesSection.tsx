import { useRef, memo } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { siteConfig } from "../data/siteConfig";

/* ── animation variants ── */

const headerVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const noteVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
  },
};

/* ── sub-components ── */

const SectionHeader = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="mb-12 lg:mb-16"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={headerVariants}
    >
      <span className="block mb-4 label-mono text-primary">Guidelines</span>
      <h2 className="headline-lg font-display text-foreground">
        <span className="text-gradient">{siteConfig.rules.headline}</span>
      </h2>
      {siteConfig.rules.description && (
        <p className="max-w-lg mt-4 body-text">
          {siteConfig.rules.description}
        </p>
      )}
    </motion.div>
  );
});
SectionHeader.displayName = "SectionHeader";

/* ── main component ── */

function RulesSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const listInView = useInView(listRef, { once: true, margin: "-100px" });

  const noteRef = useRef<HTMLDivElement>(null);
  const noteInView = useInView(noteRef, { once: true, margin: "-60px" });

  const rules = siteConfig.rules.items;

  return (
    <section
      id="rules"
      className="relative py-24 overflow-hidden lg:py-32"
      aria-labelledby="rules-heading"
    >
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
        <h2 id="rules-heading" className="sr-only">
          Event Rules and Guidelines
        </h2>

        <SectionHeader />

        {/* ── rules list ── */}
        <motion.div
          ref={listRef}
          className="space-y-3"
          initial="hidden"
          animate={listInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {rules.map((rule, i) => (
            <motion.div
              key={rule.title}
              variants={itemVariants}
              className="group"
            >
              <div
                className="flex items-start gap-4 p-5 transition-colors duration-200 rounded-xl hover:bg-card/50"
              >
                {/* number */}
                <span
                  className="flex items-center justify-center font-mono text-xs font-semibold transition-colors duration-200 rounded-md h-7 w-7 shrink-0 bg-primary/10 text-primary/60 group-hover:bg-primary/15 group-hover:text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* content */}
                <div className="min-w-0 pt-px">
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {rule.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {rule.description}
                  </p>
                </div>
              </div>

              {/* separator — hidden on last item */}
              {i < rules.length - 1 && (
                <div className="ml-[52px] mr-5 h-px bg-border/40" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* ── fair play note ── */}
        <motion.div
          ref={noteRef}
          className="mt-10"
          initial="hidden"
          animate={noteInView ? "visible" : "hidden"}
          variants={noteVariants}
        >
          <div
            className="rounded-xl border border-primary/15 bg-primary/[0.04]
                        px-5 py-4"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="mr-1.5 font-medium text-foreground">
                Fair play is non-negotiable.
              </span>
              Plagiarism or misconduct = instant disqualification.
              Judges' decisions are final. No exceptions, no appeals.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(RulesSection);