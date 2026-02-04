import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import WhatIsSection from './sections/WhatIsSection';
import WhyJoinSection from './sections/WhyJoinSection';
import WhoForSection from './sections/WhoForSection';
import TimelineSection from './sections/TimelineSection';
import MentorshipSection from './sections/MentorshipSection';
import PrizesSection from './sections/PrizesSection';
import RulesSection from './sections/RulesSection';
import PartnersSection from './sections/PartnersSection';
import FAQsSection from './sections/FAQsSection';
import RegisterSection from './sections/RegisterSection';
import FooterSection from './sections/FooterSection';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for all sections to mount and create their ScrollTriggers
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;
            
            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out"
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Sections with z-index stacking */}
      <main className="relative">
        <section className="relative z-10">
          <HeroSection />
        </section>
        <section className="relative z-20">
          <WhatIsSection />
        </section>
        <section className="relative z-30">
          <WhyJoinSection />
        </section>
        <section className="relative z-40">
          <WhoForSection />
        </section>
        <section className="relative z-50">
          <TimelineSection />
        </section>
        <section className="relative z-[60]">
          <MentorshipSection />
        </section>
        <section className="relative z-[70]">
          <PrizesSection />
        </section>
        <section className="relative z-[80]">
          <RulesSection />
        </section>
        <section className="relative z-[90]">
          <PartnersSection />
        </section>
        <section className="relative z-[100]">
          <FAQsSection />
        </section>
        <section className="relative z-[110]">
          <RegisterSection />
        </section>
        <section className="relative z-[120]">
          <FooterSection />
        </section>
      </main>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
