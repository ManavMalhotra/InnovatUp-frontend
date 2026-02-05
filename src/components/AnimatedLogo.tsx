import { useRef, useEffect, memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import gsap from 'gsap';

interface AnimatedLogoProps {
    className?: string;
    size?: number;
    animate?: boolean;
}

// Static SVG paths - defined outside component to prevent re-creation
const PATHS = {
    mane: "M100 25 L155 50 L175 100 L155 150 L100 175 L45 150 L25 100 L45 50 Z",
    bulb: "M100 45 L130 60 L140 100 L130 130 L110 145 L90 145 L70 130 L60 100 L70 60 Z",
    filament: "M100 80 L100 110 M100 110 L85 130 M100 110 L115 130"
} as const;

// Pre-defined animation variants - no recreation per render
const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const drawVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 1.5, ease: "easeInOut", delay: custom },
            opacity: { duration: 0.3, delay: custom }
        }
    })
};

const sparkVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, delay: 1.2 }
    }
};

const pulseVariants: Variants = {
    animate: {
        opacity: [0.3, 0.6, 0.3],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
};

const AnimatedLogo = memo(function AnimatedLogo({
    className = '',
    size = 200,
    animate = true
}: AnimatedLogoProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const glowRef = useRef<SVGCircleElement>(null);
    const floatTween = useRef<gsap.core.Tween | null>(null);
    const pulseTween = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (!animate || !svgRef.current) return;

        // Use one RAF loop instead of competing libraries
        floatTween.current = gsap.to(svgRef.current, {
            y: -8,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        if (glowRef.current) {
            // Animate opacity only - scale transforms on SVG filters are expensive
            pulseTween.current = gsap.to(glowRef.current, {
                opacity: 0.6,
                duration: 1.5,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }

        return () => {
            // Kill specific tweens instead of full context revert
            floatTween.current?.kill();
            pulseTween.current?.kill();
            // Reset transforms
            if (svgRef.current) gsap.set(svgRef.current, { y: 0 });
        };
    }, [animate]);

    // Static glow effect - no filter animations
    const glowStyle = {
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
    };

    return (
        <motion.div
            className={`relative ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ willChange: 'transform' }} // Hint for compositor
        >
            {/* Optimized glow - CSS animation instead of SVG filter */}
            <div
                className="absolute inset-0 blur-3xl opacity-30 pointer-events-none"
                style={glowStyle}
            />

            <svg
                ref={svgRef}
                viewBox="0 0 200 200"
                width={size}
                height={size}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
                style={{ willChange: 'transform' }}
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#58A6FF" />
                    </linearGradient>
                    {/* Static filter - no animation applied */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <circle
                    ref={glowRef}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="1"
                    opacity="0.3"
                />

                <motion.path
                    d={PATHS.mane}
                    stroke="#F0F6FC"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    variants={drawVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                />

                <motion.path
                    d={PATHS.bulb}
                    stroke="#F0F6FC"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={drawVariants}
                    custom={0.3}
                    initial="hidden"
                    animate="visible"
                />

                <motion.path
                    d={PATHS.filament}
                    stroke="#F0F6FC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={drawVariants}
                    custom={0.6}
                    initial="hidden"
                    animate="visible"
                />

                <motion.rect
                    x="85"
                    y="145"
                    width="30"
                    height="12"
                    rx="2"
                    stroke="#F0F6FC"
                    strokeWidth="2"
                    fill="none"
                    variants={drawVariants}
                    custom={0.8}
                    initial="hidden"
                    animate="visible"
                />

                <motion.g variants={sparkVariants} initial="hidden" animate="visible">
                    <path d="M100 15 L103 20 L100 25 L97 20 Z" fill="#F0F6FC" />
                    <path d="M55 40 L60 42 L55 48 L52 42 Z" fill="#F0F6FC" />
                    <path d="M145 40 L150 42 L145 48 L142 42 Z" fill="#F0F6FC" />
                </motion.g>

                <motion.g variants={pulseVariants} animate="animate">
                    <line x1="35" y1="55" x2="25" y2="45" stroke="#58A6FF" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="165" y1="55" x2="175" y2="45" stroke="#58A6FF" strokeWidth="1.5" strokeLinecap="round" />
                </motion.g>
            </svg>

            {/* CSS hover instead of motion.div whileHover */}
            <div className="absolute inset-0 rounded-full pointer-events-none 
                transition-shadow duration-300 ease-out
                group-hover:shadow-[0_0_60px_rgba(59,130,246,0.4)]"
            />
        </motion.div>
    );
});

export default AnimatedLogo;