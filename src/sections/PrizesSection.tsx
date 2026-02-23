import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkle } from "@phosphor-icons/react";
import { siteConfig } from "../data/siteConfig";

gsap.registerPlugin(ScrollTrigger);

export default function PrizesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);
  const brandWatermarkRef = useRef<HTMLDivElement>(null);

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

      // pool number — dramatic scale-up for extreme punch
      gsap.fromTo(
        poolRef.current,
        { y: 40, opacity: 0, scale: 0.8, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: poolRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // watermark subtle float
      gsap.fromTo(
        brandWatermarkRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 0.03, // Keep it very subtle
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

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

  const { extras, totalPrizePool, headline } = siteConfig.prizes;

  return (
    <section
      ref={sectionRef}
      id="prizes"
      className="relative py-24 overflow-hidden lg:py-32"
    >
      {/* ─────────── AMBIENT GLOWS ─────────── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[800px] w-[800px]
                   -translate-x-1/2 rounded-full opacity-[0.08] mix-blend-screen
                   bg-[radial-gradient(circle,hsl(var(--primary))_0%,transparent_60%)]"
      />
      <div
        className="pointer-events-none absolute left-[20%] top-[60%] h-[500px] w-[500px]
                   -translate-x-1/2 rounded-full opacity-[0.05] mix-blend-screen
                   bg-[radial-gradient(circle,hsl(var(--accent))_0%,transparent_60%)]"
      />

      {/* ─────────── BRAND WATERMARK (Subtle Authority) ─────────── */}
      <div
        ref={brandWatermarkRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
      >
        <div className="text-[150px] md:text-[250px] lg:text-[350px] font-display font-black leading-none text-white whitespace-nowrap">
          BCIIT
        </div>
      </div>

      <div className="relative z-10 max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* ─────────── HEADER ─────────── */}
        <div ref={headerRef} className="mb-8 text-center">
          <span className="block mb-4 label-mono text-primary shine-effect">
            Rewards & Stakes
          </span>
          <h2 className="headline-lg font-display text-foreground">
            <span className="text-gradient drop-shadow-lg">{headline}</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 body-text">
            Compete against the best minds and claim your share of the massive prize pool. Powered and officially backed by BCIIT.
          </p>
        </div>

        {/* ─────────── TOTAL PRIZE POOL — The Anchor of Greed ─────────── */}
        <div ref={poolRef} className="mb-20 text-center relative max-w-max mx-auto">
          <div className="absolute inset-0 glow-accent-strong rounded-full -z-10 blur-3xl opacity-50" />
          <div className="relative inline-block py-6 px-12 glass-card-hover rounded-[3rem] border-primary/20 bg-background/40 backdrop-blur-md">
            <p className="text-6xl font-black leading-none tracking-tighter font-display text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-primary sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-2xl">
              {totalPrizePool}
              <span className="text-primary inline-block transform translate-y-2 lg:translate-y-4">+</span>
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-[1px] w-12 bg-primary/40 rounded"></div>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-primary/80 glow-accent">
                In Total Prizes
              </p>
              <div className="h-[1px] w-12 bg-primary/40 rounded"></div>
            </div>
          </div>
        </div>

        {/* ─────────── PRIZE CATEGORIES HIDDEN FOR NOW ─────────── */}

        {/* ─────────── EVERY PARTICIPANT PERKS ─────────── */}
        {extras.length > 0 && (
          <div ref={extrasRef} className="mt-14 max-w-4xl mx-auto">
            {/* gradient divider */}
            <div className="w-full h-px mb-10 bg-gradient-to-r from-transparent via-primary/30 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
                <span className="text-xs font-mono font-bold text-primary/60 tracking-widest uppercase">Plus For Every Participant</span>
              </div>
            </div>

            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {extras.map((perk) => (
                  <span
                    key={perk}
                    className="inline-flex items-center rounded-xl bg-secondary/30 backdrop-blur-md
                               px-5 py-2.5 text-[14px] font-medium text-foreground/80
                               border border-white/5 shadow-sm hover:border-primary/30 transition-colors duration-300"
                  >
                    <Sparkle className="w-4 h-4 mr-2 text-primary/50" />
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