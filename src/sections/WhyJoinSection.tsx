import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Trophy, Network } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: 'Mentorship',
    description: 'Get feedback from builders who\'ve shipped.',
    icon: Users,
    rotation: -3,
  },
  {
    title: 'Prizes',
    description: 'Cash, credits, and tools to keep building.',
    icon: Trophy,
    rotation: 1,
  },
  {
    title: 'Network',
    description: 'Meet collaborators, cofounders, and future teammates.',
    icon: Network,
    rotation: 4,
  },
];

export default function WhyJoinSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const characterRef = useRef<HTMLDivElement>(null);

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
        headlineRef.current,
        { y: '-12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      // Cards entrance with stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const startRotation = [-6, 2, 8][i];
        const endRotation = [-3, 1, 4][i];
        
        scrollTl.fromTo(
          card,
          { x: '-50vw', rotate: startRotation, opacity: 0 },
          { x: 0, rotate: endRotation, opacity: 1, ease: 'none' },
          0.05 * i
        );
      });

      scrollTl.fromTo(
        characterRef.current,
        { x: '50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0.3, ease: 'power2.in' },
        0.7
      );

      cardsRef.current.forEach((card) => {
        if (!card) return;
        scrollTl.fromTo(
          card,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        );
      });

      scrollTl.fromTo(
        characterRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0.3, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section-pinned bg-neon-dark flex items-center"
    >
      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute left-[8vw] top-[10vh] max-w-[40vw]"
      >
        <h2 className="headline-lg font-display text-neon-white">
          Why join the <span className="text-neon-green">build?</span>
        </h2>
      </div>

      {/* Stacked cards */}
      {cards.map((card, index) => {
        const Icon = card.icon;
        const positions = [
          { left: '10vw', top: '30vh' },
          { left: '12vw', top: '32vh' },
          { left: '14vw', top: '34vh' },
        ];
        
        return (
          <div
            key={card.title}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="absolute w-[34vw] h-[44vh] rounded-2xl bg-card border border-white/5 shadow-card p-8 flex flex-col justify-between float-animation"
            style={{
              left: positions[index].left,
              top: positions[index].top,
              transform: `rotate(${card.rotation}deg)`,
              zIndex: 3 - index,
              animationDelay: `${index * 0.3}s`,
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-neon-white mb-2">
                {card.title}
              </h3>
              <p className="body-text">{card.description}</p>
            </div>
          </div>
        );
      })}

      {/* Character */}
      <div
        ref={characterRef}
        className="absolute right-[6vw] top-[16vh] h-[74vh]"
      >
        <img
          src="/why_character.jpg"
          alt="Why Join"
          className="h-full w-auto object-contain"
          style={{
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}
