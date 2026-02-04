import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeartHandshake, Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { title: 'Sponsors', icon: Building2, rotation: -2 },
  { title: 'Community', icon: HeartHandshake, rotation: 3 },
];

export default function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // ENTRANCE
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
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const startRotation = [-6, 6][i];
        const endRotation = [-2, 3][i];
        
        scrollTl.fromTo(
          card,
          { y: '30vh', rotate: startRotation, opacity: 0 },
          { y: 0, rotate: endRotation, opacity: 1, ease: 'none' },
          0.12 + 0.03 * i
        );
      });

      // EXIT
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
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0.25, ease: 'power2.in' },
        0.72
      );

      cardsRef.current.forEach((card) => {
        if (!card) return;
        scrollTl.fromTo(
          card,
          { y: 0, opacity: 1 },
          { y: '12vh', opacity: 0.25, ease: 'power2.in' },
          0.7
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section-pinned bg-neon-dark flex items-center"
    >
      {/* Portrait */}
      <div
        ref={portraitRef}
        className="absolute left-[7vw] top-[18vh] w-[40vw] h-[64vh] rounded-2xl overflow-hidden shadow-card"
      >
        <img
          src="/partners_portrait.jpg"
          alt="Partners"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark/60 to-transparent" />
      </div>

      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute left-[54vw] top-[22vh]"
      >
        <h2 className="headline-lg font-display text-neon-white">
          <span className="text-neon-green">Partners</span>
        </h2>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="absolute left-[54vw] top-[38vh] max-w-[34vw]"
      >
        <p className="body-text">
          Backed by student clubs, local startups, and makers who believe in 
          learning by shipping.
        </p>
      </div>

      {/* Cards */}
      {cards.map((card, index) => {
        const Icon = card.icon;
        const positions = [
          { left: '54vw', top: '60vh' },
          { left: '58vw', top: '64vh' },
        ];
        
        return (
          <div
            key={card.title}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="absolute w-[18vw] h-[20vh] rounded-2xl bg-card border border-white/5 shadow-card p-6 flex flex-col justify-between"
            style={{
              left: positions[index].left,
              top: positions[index].top,
              transform: `rotate(${card.rotation}deg)`,
              zIndex: 2 - index,
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-neon-green" />
            </div>
            <h3 className="text-lg font-display font-bold text-neon-white">
              {card.title}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
