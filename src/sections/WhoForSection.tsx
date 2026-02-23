import { useRef, useEffect, memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Code, ArrowRight, GraduationCap, Laptop, Lightbulb } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';

// Icon mapping outside component
const ICON_MAP = {
  student: GraduationCap,
  developer: Code,
  designer: Laptop,
  innovator: Lightbulb,
  default: Lightbulb,
} as const;

// Animation variants - GPU accelerated
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1], // Custom cubic-bezier for smoothness
    },
  },
};

const cardVariants: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Memoized card component
const AudienceCard = memo(function AudienceCard({
  audience,
}: {
  audience: { title: string; description: string; icon?: keyof typeof ICON_MAP };
}) {
  const Icon = ICON_MAP[audience.icon || 'default'] || ICON_MAP.default;

  return (
    <motion.div
      variants={cardVariants}
      className={`
        relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl 
        bg-card/80 backdrop-blur-sm border border-border/60
        hover:border-primary/40 hover:bg-card hover:shadow-lg
        transition-all duration-300 ease-out
        group cursor-pointer
        odd:lg:translate-y-8
      `}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon container */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" weight="duotone" />
      </div>

      {/* Title - responsive sizing */}
      <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2 leading-tight">
        {audience.title}
      </h3>

      {/* Description - ensure visibility with proper contrast */}
      <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed line-clamp-3 sm:line-clamp-none">
        {audience.description}
      </p>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
});

export default function WhoForSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check if text is actually visible (debugging helper)
  useEffect(() => {
    if (import.meta.env.DEV) {
      const checkVisibility = () => {
        const headings = sectionRef.current?.querySelectorAll('h2, h3, p');
        headings?.forEach((el) => {
          const style = window.getComputedStyle(el);
          const isVisible = style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
          if (!isVisible) {
            console.warn('Hidden text detected:', el.textContent?.slice(0, 50));
          }
        });
      };
      checkVisibility();
    }
  }, []);

  return (
    <section
      id="who-for"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 xl:py-32 overflow-hidden bg-background isolate"
    >
      {/* Background Decor - optimized with will-change */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 
                   w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]
                   bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] 
                   pointer-events-none will-change-transform"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">

          {/* Left: Content - Added relative z-10 to ensure visibility */}
          <motion.div
            className="relative z-10 space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
              <span className="inline-block label-mono text-primary text-xs sm:text-sm tracking-wider uppercase">
                Who is this for?
              </span>

              {/* Responsive headline with explicit text color */}
              <h2 className="font-display text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] sm:leading-tight">
                Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Innovators</span>
                <br className="hidden sm:block" /> like you.
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Whether you&apos;re a coding wizard, a design enthusiast, or just have a great idea,
              InnovatUp is the perfect platform to showcase your talent.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 
                          bg-primary text-primary-foreground rounded-lg sm:rounded-xl
                          font-medium text-sm sm:text-base
                          hover:bg-primary/90 hover:gap-3 transition-all duration-300
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                          active:scale-95"
              >
                Start your journey
                <ArrowRight className="w-4 h-4 transition-transform duration-300" weight="bold" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Cards Grid - Responsive columns */}
          <motion.div
            className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {siteConfig.whoFor.audiences.map((audience) => (
              <AudienceCard
                key={audience.title}
                audience={audience}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}