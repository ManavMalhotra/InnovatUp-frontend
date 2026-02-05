import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, PaintBrush, ArrowRight, GraduationCap, Laptop, Lightbulb } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';

gsap.registerPlugin(ScrollTrigger);

export default function WhoForSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content on scroll
      gsap.from('.who-content > *', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate cards
      gsap.from('.who-card', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Decor - Floating Blob */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] 
                   bg-primary/5 rounded-full blur-[120px] -z-10"
      />

      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div className="who-content space-y-8 order-last lg:order-first">
            <div>
              <span className="label-mono text-primary mb-4 block">Who is this for?</span>
              <h2 className="headline-lg font-display text-foreground">
                Built for <span className="text-gradient">Innovators</span> <br />
                like you.
              </h2>
            </div>

            <p className="body-text text-lg max-w-lg">
              Whether you're a coding wizard, a design enthusiast, or just have a great idea,
              InnovatUp is the perfect platform to showcase your talent.
            </p>

            <Link
              to="/register"
              className="btn-primary inline-flex items-center group"
            >
              Start your journey
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" weight="bold" />
            </Link>
          </div>

          {/* Right: Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {siteConfig.whoFor.audiences.map((audience, index) => {
              const icons = [GraduationCap, Code, Laptop, Lightbulb];
              const Icon = icons[index % icons.length];

              return (
                <div
                  key={audience.title}
                  className={`who-card p-6 rounded-2xl bg-card border border-border/50 
                              hover:border-primary/30 hover:bg-card/80 transition-all duration-300
                              group shadow-sm hover:shadow-md
                              ${index % 2 !== 0 ? 'lg:translate-y-12' : ''}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
