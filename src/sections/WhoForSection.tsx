import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { title: 'Developers', icon: Code, rotation: -2 },
  { title: 'Designers', icon: Palette, rotation: 3 },
];

export default function WhoForSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const startRotation = [-4, 6][i];
        const endRotation = [-2, 3][i];
        
        scrollTl.fromTo(
          card,
          { y: '30vh', rotate: startRotation, opacity: 0 },
          { y: 0, rotate: endRotation, opacity: 1, ease: 'none' },
          0.1 + 0.03 * i
        );
      });

      scrollTl.fromTo(
        ctaRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

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

      cardsRef.current.forEach((card) => {
        if (!card) return;
        scrollTl.fromTo(
          card,
          { y: 0, opacity: 1 },
          { y: '12vh', opacity: 0.25, ease: 'power2.in' },
          0.7
        );
      });

      scrollTl.fromTo(
        ctaRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );
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
          src="/who_portrait.jpg"
          alt="Who is this for"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark/60 to-transparent" />
      </div>

      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute left-[54vw] top-[24vh] max-w-[38vw]"
      >
        <h2 className="headline-lg font-display text-neon-white">
          Who is this <span className="text-neon-green">for?</span>
        </h2>
      </div>

      {/* Cards */}
      {cards.map((card, index) => {
        const Icon = card.icon;
        const positions = [
          { left: '54vw', top: '48vh' },
          { left: '58vw', top: '52vh' },
        ];
        
        return (
          <div
            key={card.title}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="absolute w-[18vw] h-[26vh] rounded-2xl bg-card border border-white/5 shadow-card p-6 flex flex-col justify-between"
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
            <h3 className="text-xl font-display font-bold text-neon-white">
              {card.title}
            </h3>
          </div>
        );
      })}

      {/* CTA */}
      <div
        ref={ctaRef}
        className="absolute left-[54vw] top-[78vh]"
      >
        <Link 
          to="/register" 
          className="btn-secondary group"
        >
          See the rules
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
