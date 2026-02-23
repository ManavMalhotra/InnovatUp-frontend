import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CalendarBlank, CaretDown } from '@phosphor-icons/react';
import AnimatedLogo from '../components/AnimatedLogo';
import CountdownTimer from '@/components/CountdownTimer';
import { siteConfig } from '../data/siteConfig';
import { ROUTES, SCROLL_TARGETS, scrollToSection } from '../data/routes';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-logo-entrance',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8 },
        0.1
      );

      tl.fromTo(
        '.hero-headline .word',
        { y: 50, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.1 },
        0.3
      );

      tl.fromTo(
        '.hero-subheadline',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.7
      );

      tl.fromTo(
        '.hero-countdown',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.9
      );

      tl.fromTo(
        '.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        1.0
      );

      tl.fromTo(
        '.hero-scroll-indicator',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        1.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven parallax
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to(logoContainerRef.current, {
        y: '15%',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(contentRef.current, {
        y: '-10%',
        opacity: 0.3,
        scrollTrigger: {
          trigger: section,
          start: '30% top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-center min-h-screen overflow-hidden bg-background"
    >
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(88,166,255,0.1)_0%,transparent_50%)]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(240,246,252,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(240,246,252,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main container - split layout on desktop */}
      <div className="relative z-20 w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-12">
        <div className="flex flex-col min-h-screen py-0 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:min-h-0 lg:py-0">

          {/* Left: Content */}
          <div
            ref={contentRef}
            className="flex flex-col items-center flex-1 text-center lg:items-start lg:text-left lg:pt-0"
          >
            {/* Headline */}
            <h1 className="hero-headline font-display font-bold 
                           leading-[0.95]
                           text-6xl 
                           md:text-6xl 
                           lg:text-6xl 
                           xl:text-7xl 
                           tracking-tight">
              {siteConfig.hero.headline.map((word, index) => (
                <span
                  key={word}
                  className={`word block ${index === siteConfig.hero.headline.length - 1
                    ? 'text-gradient'
                    : 'text-foreground'
                    }`}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="max-w-sm mt-6 hero-subheadline body-text sm:max-w-md lg:max-w-lg">
              {siteConfig.hero.subheadline}
            </p>

            {/* Countdown Timer */}
            <div className="mt-8 hero-countdown">
              <p className="mb-3 label-mono text-muted-foreground">Event starts in</p>
              <CountdownTimer />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center w-full gap-4 mt-8 hero-cta sm:flex-row sm:w-auto">
              <Link
                to={ROUTES.REGISTER}
                className="justify-center w-full text-base btn-primary group sm:w-auto"
              >
                {siteConfig.hero.ctaPrimary}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" weight="bold" />
              </Link>
              <button
                onClick={() => scrollToSection(SCROLL_TARGETS.TIMELINE)}
                className="justify-center w-full text-sm btn-secondary group sm:w-auto"
              >
                <CalendarBlank className="w-4 h-4 mr-2" weight="duotone" />
                {siteConfig.hero.ctaSecondary}
              </button>
            </div>
          </div>

          {/* Right: Logo - Large on desktop, centered on mobile */}
          <div
            ref={logoContainerRef}
            className="flex items-center justify-center flex-shrink-0 order-first mt-0 mb-8 hero-logo-entrance lg:order-last lg:my-0"
          >
            {/* Responsive Opacity Wrapper: 10% on mobile, 100% on desktop */}
            <div className="transition-opacity duration-500 opacity-10 md:opacity-100">
              <AnimatedLogo
                size={400}
                className="w-40 h-40 
                           sm:w-48 sm:h-48 
                           md:w-56 md:h-56 
                           lg:w-80 lg:h-80 
                           xl:w-96 xl:h-96 
                           2xl:w-[28rem] 2xl:h-[28rem]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute flex flex-col items-center gap-2 -translate-x-1/2 cursor-pointer hero-scroll-indicator bottom-6 sm:bottom-8 left-1/2"
        onClick={() => scrollToSection(SCROLL_TARGETS.ABOUT)}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="hidden text-xs text-muted-foreground sm:block">Scroll to explore</span>
        <CaretDown className="w-5 h-5 text-primary" weight="bold" />
      </motion.div>

      {/* Decorative particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/50"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 22}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
}
