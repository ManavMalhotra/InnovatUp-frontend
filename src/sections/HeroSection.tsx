import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CalendarBlank, CaretDown } from '@phosphor-icons/react';
import AnimatedLogo from '../components/AnimatedLogo';
import CountdownTimer from '../components/CountdownTimer';
import { siteConfig } from '../data/siteConfig';

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
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
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
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12 min-h-screen lg:min-h-0 py-0 lg:py-0">

          {/* Left: Content */}
          <div
            ref={contentRef}
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:pt-0"
          >
            {/* Headline */}
            <h1 className="hero-headline font-display font-bold 
                           text-[2.5rem] leading-[0.95]
                           sm:text-5xl 
                           md:text-6xl 
                           lg:text-7xl 
                           xl:text-8xl 
                           2xl:text-[6.5rem]
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
            <p className="hero-subheadline body-text mt-6 max-w-sm sm:max-w-md lg:max-w-lg">
              {siteConfig.hero.subheadline}
            </p>

            {/* Countdown Timer */}
            <div className="hero-countdown mt-8">
              {/* <p className="label-mono text-muted-foreground mb-3">Event starts in</p> */}
              {/* <CountdownTimer /> */}
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
              <Link
                to="/register"
                className="btn-primary group text-base w-full sm:w-auto justify-center"
              >
                {siteConfig.hero.ctaPrimary}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <button
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary group text-sm w-full sm:w-auto justify-center"
              >
                <CalendarBlank className="mr-2 w-4 h-4" weight="duotone" />
                {siteConfig.hero.ctaSecondary}
              </button>
            </div>
          </div>

          {/* Right: Logo - Large on desktop, centered on mobile */}
          <div
            ref={logoContainerRef}
            className="hero-logo-entrance flex-shrink-0 flex items-center justify-center
                       order-first lg:order-last
                       mt-0 mb-8 lg:my-0"
          >
            {/* Responsive Opacity Wrapper: 10% on mobile, 100% on desktop */}
            <div className="opacity-10 md:opacity-100 transition-opacity duration-500">
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
        className="hero-scroll-indicator absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 
                   flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => document.getElementById('what-is')?.scrollIntoView({ behavior: 'smooth' })}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs text-muted-foreground hidden sm:block">Scroll to explore</span>
        <CaretDown className="w-5 h-5 text-primary" weight="bold" />
      </motion.div>

      {/* Decorative particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
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
