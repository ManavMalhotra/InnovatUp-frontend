import { useRef, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, Warning } from '@phosphor-icons/react';
import { siteConfig } from '../data/siteConfig';

gsap.registerPlugin(ScrollTrigger);

export default function RulesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const rules = rulesRef.current?.querySelectorAll('.rule-item');
      if (rules) {
        gsap.fromTo(
          rules,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rulesRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rules"
      className="relative py-24 lg:py-32 bg-background overflow-hidden"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-mono text-primary mb-4 block">Guidelines</span>
          <h2 className="headline-lg font-display text-foreground">
            <span className="text-gradient">{siteConfig.rules.headline}</span>
          </h2>
        </motion.div>

        {/* Rules list */}
        <div ref={rulesRef} className="space-y-4">
          {siteConfig.rules.items.map((rule) => (
            <motion.div
              key={rule.title}
              className="rule-item flex items-start gap-4 p-5 rounded-2xl glass-card-hover"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5 text-primary" weight="duotone" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground mb-1">
                  {rule.title}
                </h3>
                <p className="body-text text-sm">
                  {rule.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important note */}
        <motion.div
          className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Warning className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" weight="duotone" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Fair Play Policy
            </p>
            <p className="text-sm text-muted-foreground">
              All participants must adhere to the code of conduct. Violation of rules may result in disqualification.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
