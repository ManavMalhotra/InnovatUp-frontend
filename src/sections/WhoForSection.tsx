import { useRef, memo, type MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, type Variants } from 'framer-motion';
import { Cpu, TerminalWindow, Graph, RocketLaunch, ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';

// Specific tech-focused icons
const ICONS = [Cpu, TerminalWindow, Graph, RocketLaunch];

const AUDIENCES = siteConfig.whoFor.audiences.map((aud, i) => ({
  ...aud,
  icon: ICONS[i] || Cpu,
}));

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  },
};

const InteractiveCard = memo(({ audience }: { audience: typeof AUDIENCES[0] }) => {
  const Icon = audience.icon;

  return (
    <div className="group relative flex flex-col p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/60 hover:border-primary/40 transition-all duration-300 ease-out hover:bg-card hover:-translate-y-1 shadow-sm hover:shadow-lg overflow-hidden h-full">
      {/* Background ambient center glow */}
      <div className="absolute inset-x-0 -bottom-10 h-24 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon container */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ring-1 ring-white/5 group-hover:ring-primary/30">
          <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" weight="duotone" />
        </div>

        <h3 className="text-xl font-display font-bold text-white mb-2 leading-tight">
          {audience.title}
        </h3>
        <p className="text-base text-muted-foreground/90 leading-relaxed">
          {audience.description}
        </p>
      </div>

      {/* Subtle overlay grid inside card */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(240,246,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(240,246,252,0.8) 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
    </div>
  );
});

export default function WhoForSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      id="who-for"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 xl:py-32 overflow-hidden bg-background isolate"
    >
      {/* Ambient background decor */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 
                   w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]
                   bg-primary/5 rounded-full blur-[100px] lg:blur-[120px] 
                   pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">

          {/* Left: Content */}
          <motion.div
            className="relative z-10 space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
              <span className="inline-block label-mono text-primary text-xs sm:text-sm tracking-wider uppercase">
                Target Audience
              </span>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] sm:leading-tight tracking-tight">
                Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">Innovators</span>
                <br className="hidden sm:block" /> like you.
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Whether you&apos;re a deeply technical coder or a first-time visionary, InnovatUp is built for minds that want to ship real products.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-base hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 shadow-glow-blue"
              >
                Start your journey
                <ArrowRight className="w-4 h-4" weight="bold" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Interactive Grid */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10 group/bento"
          >
            {/* Spotlight that follows cursor inside this grid container */}
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100 z-10"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    450px circle at ${mouseX}px ${mouseY}px,
                    rgba(59, 130, 246, 0.15),
                    transparent 80%
                  )
                `,
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 relative z-20">
              {AUDIENCES.map((audience, index) => (
                <motion.div
                  key={audience.title}
                  variants={itemVariants}
                  // Odd items pushed down on lg screens to create masonry effect
                  className={`transition-opacity duration-500 group-hover/bento:opacity-50 hover:!opacity-100 ${index % 2 !== 0 ? 'lg:translate-y-6' : ''}`}
                >
                  <InteractiveCard audience={audience} />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}