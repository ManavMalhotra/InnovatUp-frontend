import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'what-is', label: 'About' },
    { id: 'why-join', label: 'Why Join' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'prizes', label: 'Prizes' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'register', label: 'Register' },
];

export default function ScrollProgress() {
    const [activeSection, setActiveSection] = useState('hero');
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-3">
            {/* Progress line background */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-border rounded-full" />

            {/* Animated progress fill */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-primary rounded-full origin-top"
                style={{
                    scaleY,
                    height: '100%',
                }}
            />

            {/* Section dots */}
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="group relative z-10 flex items-center"
                    aria-label={`Scroll to ${section.label}`}
                >
                    {/* Dot */}
                    <motion.div
                        className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${activeSection === section.id
                                ? 'bg-primary border-primary scale-125'
                                : 'bg-background border-muted-foreground/50 hover:border-primary'
                            }`}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                    />

                    {/* Label tooltip */}
                    <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="px-2 py-1 bg-card border border-border rounded text-xs font-medium text-foreground whitespace-nowrap">
                            {section.label}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
