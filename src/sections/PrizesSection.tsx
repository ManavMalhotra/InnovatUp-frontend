import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "../data/siteConfig";

gsap.registerPlugin(ScrollTrigger);

/* ── icon & tier config ── */


/* ── component ── */

export default function PrizesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // header
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // pool number — slight scale-up for punch
      gsap.fromTo(
        poolRef.current,
        { y: 20, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: poolRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // prize cards stagger
      const cards = cardsRef.current?.querySelectorAll(".prize-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // extras
      if (extrasRef.current) {
        gsap.fromTo(
          extrasRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: extrasRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const {extras, totalPrizePool, headline } = siteConfig.prizes;
  // const first = categories[0];
  // const runnerUps = categories.slice(1);
  // const FirstIcon = first ? (iconMap[first.icon] || Trophy) : Trophy;

  return (
    <section
      ref={sectionRef}
      id="prizes"
      className="relative py-24 overflow-hidden lg:py-32"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px]
                   -translate-x-1/2 rounded-full opacity-[0.06]
                   bg-[radial-gradient(circle,hsl(var(--primary))_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* ─────────── HEADER ─────────── */}
        <div ref={headerRef} className="mb-4 text-center">
          <span className="block mb-4 label-mono text-primary">Prizes</span>
          <h2 className="headline-lg font-display text-foreground">
            <span className="text-gradient">{headline}</span>
          </h2>
        </div>

        {/* ─────────── TOTAL PRIZE POOL — the anchor ─────────── */}
        <div ref={poolRef} className="mb-16 text-center md:mb-20">
          <p
            className="text-5xl font-extrabold leading-none tracking-tighter font-display text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {totalPrizePool}
            <span className="text-primary">+</span>
          </p>
          <p
            className="mt-3 font-mono text-xs uppercase tracking-[0.2em]
                       text-muted-foreground/50"
          >
            in total prizes
          </p>
        </div>

        {/* ─────────── PRIZE CARDS ─────────── */}

        {/* ─────────── EVERY PARTICIPANT PERKS ─────────── */}
        {extras.length > 0 && (
          <div ref={extrasRef} className="mt-14">
            {/* gradient divider */}
            <div className="w-full h-px mb-10 bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="text-center">
              <p className="mb-5 text-sm font-medium text-muted-foreground/70">
                For every participant
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {extras.map((perk) => (
                  <span
                    key={perk}
                    className="inline-flex items-center rounded-full bg-secondary/50
                               px-4 py-1.5 text-[13px] text-muted-foreground/80
                               ring-1 ring-inset ring-border"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}