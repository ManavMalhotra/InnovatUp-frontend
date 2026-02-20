import { useRef, useLayoutEffect } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RocketLaunch, Hammer, PresentationChart } from "@phosphor-icons/react";
import { siteConfig } from "../data/siteConfig";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<
  string,
  React.FC<{
    className?: string;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  }>
> = {
  rocket: RocketLaunch,
  hammer: Hammer,
  presentation: PresentationChart,
};

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            rotate: index % 2 === 0 ? -2 : 2,
          },
          {
            x: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-24 overflow-hidden lg:py-32 bg-card/30"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-5xl px-4 mx-auto sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="block mb-4 label-mono text-primary">Schedule</span>
          <h2 className="headline-lg font-display text-foreground">
            <span className="text-gradient">Event Schedule</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line with glow */}
          <div
            ref={lineRef}
            className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30 origin-top"
            style={{
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            }}
          />

          {/* Timeline events */}
          <div className="space-y-12">
            {siteConfig.timeline.map((event, index) => {
              const Icon = iconMap[event.icon] || RocketLaunch;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={event.title}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`relative flex items-center gap-6 lg:gap-0 ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute z-10 w-4 h-4 -translate-x-1/2 border-4 rounded-full left-4 lg:left-1/2 bg-primary border-background" />

                  {/* Card */}
                  <div
                    className={`ml-12 lg:ml-0 lg:w-[45%] ${
                      isLeft ? "lg:pr-12" : "lg:pl-12"
                    }`}
                  >
                    <motion.div
                      className="p-6 rounded-2xl glass-card-hover"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
                          <Icon
                            className="w-6 h-6 text-primary"
                            weight="duotone"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs label-mono text-primary">
                            {event.date}
                          </span>
                          <h3 className="mt-1 text-lg font-bold font-display text-foreground">
                            {event.title}
                          </h3>
                          <p className="mt-2 text-sm body-text">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden lg:block lg:w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom text */}
        <motion.p
          className="mt-12 text-sm text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Join on-campus
        </motion.p>
      </div>
    </section>
  );
}
