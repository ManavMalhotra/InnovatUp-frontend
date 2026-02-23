import { useEffect, useRef, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../components/Navigation";
import CustomCursor from "../components/CustomCursor";
import ScrollProgress from "../components/ScrollProgress";
import Preloader from "../components/Preloader";
import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import WhoForSection from "../sections/WhoForSection";
import Venue from "../components/Venue";
import FAQsSection from "../sections/FAQsSection";
import RegisterSection from "../sections/RegisterSection";
import FooterSection from "../sections/FooterSection";

// Lazy-loaded heavy sections
const TimelineSection = lazy(() => import("../sections/TimelineSection"));
const PrizesSection = lazy(() => import("../sections/PrizesSection"));
const RulesSection = lazy(() => import("../sections/RulesSection"));

import { useDeviceCapability } from "../hooks/useDeviceCapability";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    const mainRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { isMobile } = useDeviceCapability();

    useEffect(() => {
        // Refresh ScrollTrigger only when the component is fully loaded and mounted
        if (isLoaded) {
            // Use a slight timeout to ensure React DOM is painted
            const timer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 50);

            const resizeObserver = new ResizeObserver(() => {
                ScrollTrigger.refresh();
            });

            if (mainRef.current) {
                resizeObserver.observe(mainRef.current);
            }

            return () => {
                clearTimeout(timer);
                resizeObserver.disconnect();
                ScrollTrigger.getAll().forEach((st) => st.kill());
            };
        }
    }, [isLoaded]);

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

                <main className="relative overflow-hidden w-full">
                    <HeroSection />
                    <AboutSection />
                    <WhoForSection />
                    <Suspense fallback={<div className="min-h-[20vh]" />}>
                        <PrizesSection />
                        <TimelineSection />
                        <Venue />
                        <RulesSection />
                    </Suspense>
                    {/* Sponsors section removed as requested */}
                    <FAQsSection />
                    <RegisterSection />
                    <FooterSection />
                </main>
            </div>
        </>
    );
}
