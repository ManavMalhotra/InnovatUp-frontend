import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Hammer, Presentation, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timelineCards = [
  {
    day: 'Day 0',
    title: 'Kickoff',
    description: 'Challenge drops + team formation.',
    icon: Rocket,
    rotation: -1,
  },
  {
    day: 'Day 1',
    title: 'Build',
    description: 'Mentor rounds + checkpoint.',
    icon: Hammer,
    rotation: 1,
  },
  {
    day: 'Day 2',
    title: 'Demo',
    description: 'Final pitches + winners.',
    icon: Presentation,
    rotation: 3,
  },
];

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const infoCardRef = useRef<HTMLDivElement>(null);

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
        const rotations = [-3, 2, 7];
        const endRotations = [-1, 1, 3];
        
        scrollTl.fromTo(
          card,
          { x: '50vw', rotate: rotations[i], opacity: 0 },
          { x: 0, rotate: endRotations[i], opacity: 1, ease: 'none' },
          0.05 + 0.03 * i
        );
      });

      scrollTl.fromTo(
        infoCardRef.current,
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
        infoCardRef.current,
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
      id="timeline"
      className="section-pinned bg-neon-dark flex items-center"
    >
      {/* Portrait */}
      <div
        ref={portraitRef}
        className="absolute left-[7vw] top-[18vh] w-[40vw] h-[64vh] rounded-2xl overflow-hidden shadow-card"
      >
        <img
          src="/timeline_portrait.jpg"
          alt="Timeline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark/60 to-transparent" />
      </div>

      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute left-[54vw] top-[16vh]"
      >
        <h2 className="headline-lg font-display text-neon-white">
          <span className="text-neon-green">Timeline</span>
        </h2>
      </div>

      {/* Timeline cards */}
      {timelineCards.map((card, index) => {
        const Icon = card.icon;
        const positions = [
          { left: '54vw', top: '30vh' },
          { left: '56vw', top: '34vh' },
          { left: '58vw', top: '38vh' },
        ];
        
        return (
          <div
            key={card.day}
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
              <span className="label-mono text-neon-green">{card.day}</span>
              <h3 className="text-xl font-display font-bold text-neon-white mt-1">
                {card.title}
              </h3>
              <p className="body-text text-sm mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}

      {/* Info card */}
      <div
        ref={infoCardRef}
        className="absolute left-[54vw] top-[70vh] w-[20vw] h-[14vh] rounded-2xl bg-card border border-white/5 p-5 flex flex-col justify-center"
      >
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-neon-green" />
          <span className="label-mono text-neon-gray">All times IST</span>
        </div>
        <span className="text-sm text-neon-white">Virtual + On-campus</span>
      </div>
    </div>
  );
}
