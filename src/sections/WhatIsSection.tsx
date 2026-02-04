import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhatIsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const accentCardRef = useRef<HTMLDivElement>(null);

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
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        portraitRef.current,
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        accentCardRef.current,
        { y: '30vh', scale: 0.9, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0.15
      );

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        portraitRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0.3, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bodyRef.current,
        { opacity: 1 },
        { opacity: 0.3, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        accentCardRef.current,
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0.2, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="what-is"
      className="section-pinned bg-neon-dark flex items-center"
    >
      {/* Left portrait card */}
      <div
        ref={portraitRef}
        className="absolute left-[7vw] top-[18vh] w-[40vw] h-[64vh] rounded-2xl overflow-hidden shadow-card"
      >
        <img
          src="/what_portrait.jpg"
          alt="What is InnovatUp"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark/60 to-transparent" />
      </div>

      {/* Right headline */}
      <div
        ref={headlineRef}
        className="absolute left-[54vw] top-[26vh] max-w-[38vw]"
      >
        <h2 className="headline-lg font-display text-neon-white">
          What is<br />
          <span className="text-neon-green">InnovatUp?</span>
        </h2>
      </div>

      {/* Right paragraph */}
      <div
        ref={bodyRef}
        className="absolute left-[54vw] top-[44vh] max-w-[34vw]"
      >
        <p className="body-text">
          A college-wide ideathon: pick a challenge, form a team, and ship a prototype 
          in 48 hours. You'll get mentorship, feedback, and a shot at prizes—and maybe 
          your first users.
        </p>
      </div>

      {/* Accent card */}
      <div
        ref={accentCardRef}
        className="absolute left-[54vw] top-[66vh] w-[18vw] h-[16vh] rounded-2xl bg-card border border-white/5 flex flex-col items-center justify-center glow-accent"
      >
        <span className="text-4xl font-display font-bold text-neon-green">48</span>
        <span className="label-mono text-neon-gray mt-1">hrs</span>
        <span className="text-sm text-neon-white mt-2">Build + Demo</span>
      </div>
    </div>
  );
}
