import { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CaretDown, Question } from '@phosphor-icons/react';
import { siteConfig } from '../data/siteConfig';

gsap.registerPlugin(ScrollTrigger);

export default function FAQsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

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
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const faqs = faqsRef.current?.querySelectorAll('.faq-item');
      if (faqs) {
        gsap.fromTo(
          faqs,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: faqsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="faqs"
      className="relative py-24 lg:py-32 bg-card/30 overflow-hidden"
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div ref={headlineRef} className="text-center mb-12">
          <span className="label-mono text-primary mb-4 block">Got questions?</span>
          <h2 className="headline-lg font-display text-foreground">
            <span className="text-gradient">FAQs</span>
          </h2>
        </div>

        {/* FAQ items */}
        <div ref={faqsRef} className="space-y-3">
          {siteConfig.faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="faq-item"
              layout
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 
                  ${openIndex === index
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-card border border-border hover:border-primary/30'
                  }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Question className={`w-5 h-5 flex-shrink-0 transition-colors
                      ${openIndex === index ? 'text-primary' : 'text-muted-foreground'}`}
                      weight="duotone"
                    />
                    <span className={`font-medium transition-colors
                      ${openIndex === index ? 'text-foreground' : 'text-foreground'}`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CaretDown className={`w-5 h-5 transition-colors
                      ${openIndex === index ? 'text-primary' : 'text-muted-foreground'}`}
                      weight="bold"
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="body-text pt-4 pl-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            Still have questions?{' '}
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="text-primary hover:underline"
            >
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
