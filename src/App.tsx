import { useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "./components/Navigation";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Preloader from "./components/Preloader";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import HeroSection from "./sections/HeroSection";

import WhoForSection from "./sections/WhoForSection";
import TimelineSection from "./sections/TimelineSection";
// import MentorshipSection from "./sections/MentorshipSection";
import PrizesSection from "./sections/PrizesSection";
import RulesSection from "./sections/RulesSection";
import FAQsSection from "./sections/FAQsSection";
import RegisterSection from "./sections/RegisterSection";
import FooterSection from "./sections/FooterSection";
// Lazy load pages
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
import { useDeviceCapability } from "./hooks/useDeviceCapability";
import Venue from "./components/Venue";

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isMobile } = useDeviceCapability();

  useEffect(() => {
    // Refresh ScrollTrigger after all content loads
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      {/* Preloader */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      <div
        ref={mainRef}
        className={`relative ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      >
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Custom cursor - desktop only */}
        {!isMobile && <CustomCursor />}

        {/* Scroll progress indicator - desktop only */}
        <ScrollProgress />

        {/* Navigation */}
        <Navigation />

        {/* Sections */}
        <main className="relative">
          <HeroSection />
          <WhoForSection />
          <TimelineSection />
          <Venue />
          {/* <MentorshipSection /> */}
          <PrizesSection />
          <RulesSection />
          {/* Sponsors section removed as requested */}
          <FAQsSection />
          <RegisterSection />
          <FooterSection />
        </main>
      </div>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Simple loading spinner for Suspense fallback
const LoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 rounded-full border-primary/30 border-t-primary animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestRoute />}>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
