import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Wireframe SVG Component
function WireframeObject({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`${className} wireframe-glow`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer icosahedron-like wireframe */}
      <path
        d="M200 20L380 120V280L200 380L20 280V120L200 20Z"
        stroke="#B6FF2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M20 120L200 200L380 120"
        stroke="#B6FF2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M200 200V380"
        stroke="#B6FF2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M200 20L200 200"
        stroke="#B6FF2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M20 280L200 200"
        stroke="#B6FF2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M380 280L200 200"
        stroke="#B6FF2E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {/* Inner geometric details */}
      <circle
        cx="200"
        cy="200"
        r="80"
        stroke="#B6FF2E"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle
        cx="200"
        cy="200"
        r="40"
        stroke="#B6FF2E"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Corner accents */}
      <path
        d="M200 20L220 50L180 50Z"
        stroke="#B6FF2E"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M380 120L350 140L350 100Z"
        stroke="#B6FF2E"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M20 120L50 100L50 140Z"
        stroke="#B6FF2E"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wireframeRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Wireframe entrance
      tl.fromTo(
        wireframeRef.current,
        { scale: 0.85, opacity: 0, rotate: 8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.9 },
        0
      );

      // Character entrance
      tl.fromTo(
        characterRef.current,
        { x: '18vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        0.1
      );

      // Label entrance
      tl.fromTo(
        labelRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.2
      );

      // Headline entrance (word by word)
      const words = headlineRef.current?.querySelectorAll('.word');
      if (words) {
        tl.fromTo(
          words,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          0.3
        );
      }

      // Subheadline entrance
      tl.fromTo(
        subheadlineRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.6
      );

      // CTA entrance
      tl.fromTo(
        ctaRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back
            gsap.set([wireframeRef.current, characterRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current, labelRef.current], {
              opacity: 1, x: 0, y: 0, scale: 1
            });
          }
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-28vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        subheadlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-20vw', opacity: 0.25, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.85
      );

      scrollTl.fromTo(
        labelRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        characterRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        wireframeRef.current,
        { scale: 1, opacity: 1 },
        { scale: 0.92, opacity: 0.35, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section-pinned bg-neon-dark flex items-center justify-center"
    >
      {/* Background vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,13,0.8)_100%)]" />

      {/* Wireframe object (center) */}
      <div
        ref={wireframeRef}
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[min(52vw,720px)] z-10 float-animation"
      >
        <WireframeObject />
      </div>

      {/* Hero character (right) */}
      <div
        ref={characterRef}
        className="absolute right-[6vw] top-[18vh] h-[72vh] z-20"
      >
        <img
          src="/hero_character.jpg"
          alt="Innovator"
          className="h-full w-auto object-contain mask-image-gradient"
          style={{
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          }}
        />
      </div>

      {/* Micro label (top-left) */}
      <div
        ref={labelRef}
        className="absolute left-[8vw] top-[14vh] z-30"
      >
        <span className="label-mono text-neon-green">College Ideathon 2026</span>
      </div>

      {/* Headline (left) */}
      <div
        ref={headlineRef}
        className="absolute left-[8vw] top-[30vh] max-w-[42vw] z-30"
      >
        <h1 className="headline-xl font-display text-neon-white">
          <span className="word block">Innovate.</span>
          <span className="word block">Build.</span>
          <span className="word block text-neon-green">Launch.</span>
        </h1>
      </div>

      {/* Subheadline (left) */}
      <div
        ref={subheadlineRef}
        className="absolute left-[8vw] top-[62vh] max-w-[34vw] z-30"
      >
        <p className="body-text">
          A 48-hour sprint where ideas become working prototypes—mentors, prizes, and real momentum.
        </p>
      </div>

      {/* CTA (left) */}
      <div
        ref={ctaRef}
        className="absolute left-[8vw] top-[74vh] z-30 flex flex-col gap-4"
      >
        <Link to="/register" className="btn-primary group">
          Register Now
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <button 
          onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 text-sm text-neon-gray hover:text-neon-white transition-colors"
        >
          <Calendar className="w-4 h-4" />
          View Timeline
        </button>
      </div>
    </div>
  );
}
