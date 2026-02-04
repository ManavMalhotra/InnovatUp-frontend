import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Lightbulb, Ticket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const faqCards = [
  {
    question: 'Do I need a team?',
    answer: 'You can join solo and form a team at kickoff.',
    icon: Users,
    rotation: -1,
  },
  {
    question: 'What if I\'m a beginner?',
    answer: 'Mentors are here to help. Start simple.',
    icon: Lightbulb,
    rotation: 1,
  },
  {
    question: 'Is it free?',
    answer: 'Yes. Register before the deadline.',
    icon: Ticket,
    rotation: 3,
  },
];

export default function FAQsSection() {
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
        ctaRef.current,
        { y: '12vh', opacity: 0 },
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
      id="faqs"
      className="section-pinned bg-neon-dark flex items-center"
    >
      {/* Portrait */}
      <div
        ref={portraitRef}
        className="absolute left-[7vw] top-[18vh] w-[40vw] h-[64vh] rounded-2xl overflow-hidden shadow-card"
      >
        <img
          src="/faqs_portrait.jpg"
          alt="FAQs"
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
          <span className="text-neon-green">FAQs</span>
        </h2>
      </div>

      {/* FAQ cards */}
      {faqCards.map((card, index) => {
        const Icon = card.icon;
        const positions = [
          { left: '54vw', top: '32vh' },
          { left: '56vw', top: '36vh' },
          { left: '58vw', top: '40vh' },
        ];
        
        return (
          <div
            key={card.question}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="absolute w-[36vw] h-[20vh] rounded-2xl bg-card border border-white/5 shadow-card p-6 flex items-center gap-6"
            style={{
              left: positions[index].left,
              top: positions[index].top,
              transform: `rotate(${card.rotation}deg)`,
              zIndex: 3 - index,
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-neon-white">
                {card.question}
              </h3>
              <p className="body-text text-sm mt-1">{card.answer}</p>
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div
        ref={ctaRef}
        className="absolute left-[54vw] top-[76vh]"
      >
        <Link to="/register" className="btn-primary group">
          Register Now
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
