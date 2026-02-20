import { useRef, useLayoutEffect } from "react";
// import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { Crown, Medal, Trophy } from "@phosphor-icons/react";
import { siteConfig } from "../data/siteConfig";

gsap.registerPlugin(ScrollTrigger);

// const iconMap: Record<
//   string,
//   React.FC<{
//     className?: string;
//     weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
//   }>
// > = {
//   crown: Crown,
//   medal: Medal,
//   sparkles: Trophy,
// };

// const prizeStyles = [
//   { gradient: "from-yellow-500/20 to-amber-500/10", icon: "text-yellow-400" },
//   { gradient: "from-slate-400/20 to-slate-500/10", icon: "text-slate-300" },
//   { gradient: "from-orange-600/20 to-amber-600/10", icon: "text-orange-400" },
// ];

export default function PrizesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const cards = cardsRef.current?.querySelectorAll(".prize-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.fromTo(
        extrasRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: extrasRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="prizes"
      className="relative py-24 overflow-hidden lg:py-32 bg-background"
    >
      {/* Radial spotlight behind first prize */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-5xl px-4 mx-auto sm:px-6 lg:px-12">
        {/* Header */}
        <div ref={headlineRef} className="mb-16 text-center">
          <span className="block mb-4 label-mono text-primary">
            What you can win
          </span>
          <h2 className="mb-2 headline-lg font-display text-foreground">
            <span className="text-gradient">{siteConfig.prizes.headline}</span>
          </h2>
          <p className="text-lg font-bold text-primary font-display">
            upto {siteConfig.prizes.totalPrizePool} in prizes
          </p>
        </div>

        {/* Prize cards */}
        {/* <div ref={cardsRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {siteConfig.prizes.categories.map((prize, index) => {
            const Icon = iconMap[prize.icon] || Trophy;
            const style = prizeStyles[index] || prizeStyles[2];
            const isFirst = index === 0;

            return (
              <motion.div
                key={prize.title}
                className={`prize-card p-6 rounded-2xl glass-card-hover text-center ${
                  isFirst ? "md:scale-105 md:-translate-y-2" : ""
                }`}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-8 h-8 ${style.icon}`} weight="duotone" />
                </div>
                <h3 className="mb-1 text-xl font-bold font-display text-foreground">
                  {prize.title}
                </h3>
                <p className="mb-2 text-2xl font-bold font-display text-primary">
                 {prize.amount}
                </p>
                <p className="text-sm body-text">{prize.description}</p>
              </motion.div>
            );
          })}
        </div> */}

        {/* Extras */}
        <div ref={extrasRef} className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Plus for all participants: {siteConfig.prizes.extras.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
