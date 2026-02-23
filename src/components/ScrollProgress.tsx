import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'who-for', label: 'Who For' },
    { id: 'prizes', label: 'Prizes' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'venue', label: 'Venue' },
    { id: 'rules', label: 'Rules' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'register', label: 'Register' },
] as const;

// Memoized section item to prevent re-renders of all dots when one changes
const SectionDot = memo(function SectionDot({
    section,
    isActive,
    onClick,
}: {
    section: typeof sections[number];
    isActive: boolean;
    onClick: (id: string) => void;
}) {
    return (
        <button
            onClick={() => onClick(section.id)}
            className="group relative z-10 flex items-center p-2 -m-2" // Larger touch target
            aria-label={`Scroll to ${section.label}`}
        >
            <motion.div
                className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${isActive
                    ? 'bg-primary border-primary'
                    : 'bg-background border-muted-foreground/50 hover:border-primary'
                    }`}
                animate={{ scale: isActive ? 1.25 : 1 }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />

            <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="px-2 py-1 bg-card border border-border rounded text-xs font-medium text-foreground whitespace-nowrap shadow-sm">
                    {section.label}
                </div>
            </div>
        </button>
    );
});

export default function ScrollProgress() {
    const [activeSection, setActiveSection] = useState<string>('hero');
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate scaleY based on active section index instead of physical scroll
    const activeIndex = sections.findIndex((s) => s.id === activeSection);
    const fillPercentage = sections.length > 1 ? activeIndex / (sections.length - 1) : 0;

    // Cache element references to avoid repeated DOM queries
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

    // Populate refs once on mount
    useEffect(() => {
        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                sectionRefs.current.set(section.id, element);
            }
        });
    }, []);

    // Intersection Observer setup - runs off main thread
    useEffect(() => {
        const observerCallback: IntersectionObserverCallback = (entries) => {
            // Find the most visible section
            let maxIntersection = 0;
            let mostVisibleSection = activeSection;

            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > maxIntersection) {
                    maxIntersection = entry.intersectionRatio;
                    mostVisibleSection = entry.target.id;
                }
            });

            // Only update state if changed - prevents re-renders
            if (mostVisibleSection !== activeSection) {
                setActiveSection(mostVisibleSection);
            }
        };

        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '-30% 0px -30% 0px', // Trigger when section is in middle 40% of viewport
            threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for precision
        });

        // Observe all sections
        sectionRefs.current.forEach((element) => {
            observer.observe(element);
        });

        return () => observer.disconnect();
    }, [activeSection]);

    // Memoized scroll handler
    const scrollToSection = useCallback((id: string) => {
        const element = sectionRefs.current.get(id) || document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-4 py-4"
        >
            {/* Progress line background */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-border rounded-full" />

            {/* Animated progress fill - perfectly aligns with dots */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-primary rounded-full origin-top"
                initial={false}
                animate={{ scaleY: fillPercentage }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />

            {/* Section dots */}
            <div className="flex flex-col items-center gap-4">
                {sections.map((section) => (
                    <SectionDot
                        key={section.id}
                        section={section}
                        isActive={activeSection === section.id}
                        onClick={scrollToSection}
                    />
                ))}
            </div>
        </div>
    );
}