import { useRef, useEffect, memo, useMemo } from 'react';
// import { useCallback } from 'react';
import { motion, useInView, type Variants } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, Warning, type Icon } from '@phosphor-icons/react';
import { siteConfig } from '../data/siteConfig';

// Register GSAP plugins once at module level
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ═══════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════

interface RuleItem {
  title: string;
  description: string;
  icon?: Icon;
}

interface RuleCardProps {
  rule: RuleItem;
  index: number;
}

interface ImportantNoteProps {
  title: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const ANIMATION_CONFIG = {
  stagger: 0.08,
  duration: 0.5,
  y: 30,
  ease: 'power3.out',
} as const;

const SCROLL_TRIGGER_CONFIG = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
} as const;

// ═══════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════

const headerVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const noteVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3 },
  },
};

const cardHoverVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 4 },
};

// ═══════════════════════════════════════════════════════════════════
// STYLES - Extracted for performance
// ═══════════════════════════════════════════════════════════════════

const gridPatternStyle: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
    linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
  `,
  backgroundSize: '48px 48px',
};

// ═══════════════════════════════════════════════════════════════════
// CUSTOM HOOKS
// ═══════════════════════════════════════════════════════════════════

/**
 * Custom hook for GSAP stagger animation with ScrollTrigger
 */
const useStaggerAnimation = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  itemSelector: string,
  config = ANIMATION_CONFIG
) => {
  // Fix: Context is likely exported directly on gsap or we can use generic cleanup type. 
  // In modern GSAP types, it's often just gsap.Context
  const animationRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Small delay to ensure DOM is ready
    const timeoutId = requestAnimationFrame(() => {
      animationRef.current = gsap.context(() => {
        const items = container.querySelectorAll(itemSelector);

        if (items.length === 0) return;

        // Set initial state
        gsap.set(items, {
          y: config.y,
          opacity: 0,
          willChange: 'transform, opacity'
        });

        // Create animation
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: config.duration,
          stagger: config.stagger,
          ease: config.ease,
          scrollTrigger: {
            trigger: container,
            ...SCROLL_TRIGGER_CONFIG,
            onLeaveBack: () => {
              gsap.to(items, {
                y: config.y,
                opacity: 0,
                duration: config.duration * 0.5,
                stagger: config.stagger * 0.5,
              });
            },
          },
          onComplete: () => {
            // Clean up will-change after animation
            gsap.set(items, { willChange: 'auto' });
          },
        });
      }, container);
    });

    return () => {
      cancelAnimationFrame(timeoutId);
      animationRef.current?.revert();

      // Kill any remaining ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [containerRef, itemSelector, config]);
};

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

/** Section header with label and headline */
const SectionHeader = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className="text-center mb-12 lg:mb-16"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={headerVariants}
    >
      <span className="label-mono text-primary mb-4 block">
        Guidelines
      </span>
      <h2 className="headline-lg font-display text-foreground">
        <span className="text-gradient">{siteConfig.rules.headline}</span>
      </h2>
    </motion.div>
  );
});
SectionHeader.displayName = 'SectionHeader';

// ─────────────────────────────────────────────────────────────────

/** Individual rule card with icon and content */
const RuleCard = memo<RuleCardProps>(({ rule, index }) => {
  const IconComponent = rule.icon || CheckCircle;

  return (
    <motion.article
      className="rule-item"
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      transition={{ duration: 0.2 }}
      aria-labelledby={`rule-title-${index}`}
    >
      <div className="flex items-start gap-4 p-5 rounded-2xl glass-card-hover">
        {/* Icon container */}
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 
                     flex items-center justify-center flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <IconComponent className="w-5 h-5 text-primary" weight="duotone" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3
            id={`rule-title-${index}`}
            className="font-display font-bold text-foreground mb-1"
          >
            {rule.title}
          </h3>
          <p className="body-text text-sm leading-relaxed">
            {rule.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
});
RuleCard.displayName = 'RuleCard';

// ─────────────────────────────────────────────────────────────────

/** Important note/warning banner */
const ImportantNote = memo<ImportantNoteProps>(({ title, description }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.aside
      ref={ref}
      className="mt-8 lg:mt-12 p-5 rounded-2xl bg-primary/5 border border-primary/20"
      variants={noteVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      role="note"
      aria-label="Important information"
    >
      <div className="flex items-start gap-4">
        <Warning
          className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
          weight="duotone"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm text-foreground font-medium mb-1">
            {title}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.aside>
  );
});
ImportantNote.displayName = 'ImportantNote';

// ─────────────────────────────────────────────────────────────────

/** Background grid pattern */
const GridPattern = memo(() => (
  <div
    className="absolute inset-0 opacity-[0.02] pointer-events-none"
    style={gridPatternStyle}
    aria-hidden="true"
  />
));
GridPattern.displayName = 'GridPattern';

// ─────────────────────────────────────────────────────────────────

/** Rules list container */
interface RulesListProps {
  rules: RuleItem[];
}

const RulesList = memo<RulesListProps>(({ rules }) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Apply GSAP stagger animation
  useStaggerAnimation(listRef, '.rule-item');

  return (
    <div
      ref={listRef}
      className="space-y-4"
      role="list"
      aria-label="Event rules and guidelines"
    >
      {rules.map((rule, index) => (
        <div key={rule.title} role="listitem">
          <RuleCard rule={rule} index={index} />
        </div>
      ))}
    </div>
  );
});
RulesList.displayName = 'RulesList';

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

function RulesSection() {
  // Memoize rules array to prevent unnecessary re-renders
  const rules = useMemo(() => siteConfig.rules.items as RuleItem[], []);

  // Memoize note content
  const noteContent = useMemo(() => ({
    title: 'Fair Play Policy',
    description: 'All participants must adhere to the code of conduct. Violation of rules may result in disqualification.',
  }), []);

  return (
    <section
      id="rules"
      className="relative py-24 lg:py-32 bg-background overflow-hidden"
      aria-labelledby="rules-heading"
    >
      {/* Background pattern */}
      <GridPattern />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Screen reader heading */}
        <h2 id="rules-heading" className="sr-only">
          Event Rules and Guidelines
        </h2>

        {/* Visible header */}
        <SectionHeader />

        {/* Rules list with GSAP animation */}
        <RulesList rules={rules} />

        {/* Important note */}
        <ImportantNote {...noteContent} />
      </div>
    </section>
  );
}

export default memo(RulesSection);