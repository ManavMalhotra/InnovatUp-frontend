import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function RegisterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    teamSize: '',
  });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
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
        subheadlineRef.current,
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        formCardRef.current,
        { y: '60vh', scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0.1
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

      scrollTl.fromTo(
        subheadlineRef.current,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0.25, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        formCardRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0.25, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to full registration page
    window.location.href = '/register';
  };

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
          src="/register_portrait.jpg"
          alt="Register"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-dark/60 to-transparent" />
      </div>

      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute left-[54vw] top-[14vh]"
      >
        <h2 className="headline-lg font-display text-neon-white">
          Ready to <span className="text-neon-green">build?</span>
        </h2>
      </div>

      {/* Subheadline */}
      <div
        ref={subheadlineRef}
        className="absolute left-[54vw] top-[26vh] max-w-[36vw]"
      >
        <p className="body-text">
          Save your spot. We'll send the briefing + schedule.
        </p>
      </div>

      {/* Form card */}
      <div
        ref={formCardRef}
        className="absolute left-[54vw] top-[36vh] w-[36vw] h-[44vh] rounded-2xl bg-card border border-white/5 shadow-card p-8"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="space-y-4 flex-1">
            <div>
              <label className="label-mono text-neon-gray block mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="label-mono text-neon-gray block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                placeholder="you@college.edu"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="label-mono text-neon-gray block mb-2">College</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                  placeholder="Your college"
                />
              </div>
              <div className="w-24">
                <label className="label-mono text-neon-gray block mb-2">Team</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-neon-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all appearance-none"
                >
                  <option value="">Size</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button type="submit" className="btn-primary w-full group">
              Register
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-neon-gray mt-3 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
