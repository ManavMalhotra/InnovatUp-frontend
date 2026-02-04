import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown, Medal, Sparkles, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const prizeCards = [
  {
    title: 'Grand Prize',
    description: 'Cash + credits + feature spotlight.',
    icon: Crown,
    rotation: -2,
  },
  {
    title: 'Runner-Up',
    description: 'Credits + mentorship session.',
    icon: Medal,
    rotation: 1,
  },
  {
    title: 'Wildcard',
    description: 'Most creative demo wins swag + tools.',
    icon: Sparkles,
    rotation: 4,
  },
];

export default function PrizesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const noteCardRef = useRef<HTMLDivElement>(null);

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
        { y: '-10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const rotations = [-2, 1, 4];
        
        scrollTl.fromTo(
          card,
          { x: '50vw', rotate: rotations[i], opacity: 0 },
          { x: 0, rotate: rotations[i], opacity: 1, ease: 'none' },
          0.05 + 0.03 * i
        );
      });

      scrollTl.fromTo(
        noteCardRef.current,
        { y: '20vh', scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
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
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      cardsRef.current.forEach((card) => {
        if (!card) return;
        scrollTl.fromTo(
          card,
          { x: 0, opacity: 1 },
          { x: '14vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        );
      });

      scrollTl.fromTo(
        noteCardRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0.2, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="prizes"
      className="section-pinned bg-neon-dark flex items-center"
    >
      {/* Portrait */}
      <div
        ref={portraitRef}
        className="absolute left-[7vw] top-[18vh] w-[40vw] h-[64vh] rounded-2xl overflow-hidden shadow-card"
      >
        <img
          src="/prizes_portrait.jpg"
          alt="Prizes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark/60 to-transparent" />
      </div>

      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute left-[54vw] top-[18vh]"
      >
        <h2 className="headline-lg font-display text-neon-white">
          <span className="text-neon-green">Prizes</span>
        </h2>
      </div>

      {/* Prize cards */}
      {prizeCards.map((card, index) => {
        const Icon = card.icon;
        const positions = [
          { left: '54vw', top: '32vh' },
          { left: '56vw', top: '36vh' },
          { left: '58vw', top: '40vh' },
        ];
        
        return (
          <div
            key={card.title}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="absolute w-[36vw] h-[22vh] rounded-2xl bg-card border border-white/5 shadow-card p-6 flex items-center gap-6"
            style={{
              left: positions[index].left,
              top: positions[index].top,
              transform: `rotate(${card.rotation}deg)`,
              zIndex: 3 - index,
            }}
          >
            <div className="w-14 h-14 rounded-xl bg-neon-green/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-neon-green" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-neon-white">
                {card.title}
              </h3>
              <p className="body-text text-sm mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}

      {/* Note card */}
      <div
        ref={noteCardRef}
        className="absolute left-[54vw] top-[70vh] w-[20vw] h-[14vh] rounded-2xl bg-neon-green/10 border border-neon-green/20 p-5 flex items-center gap-3"
      >
        <Award className="w-6 h-6 text-neon-green flex-shrink-0" />
        <span className="text-sm text-neon-white">
          Certificates for all participants
        </span>
      </div>
    </div>
  );
}
