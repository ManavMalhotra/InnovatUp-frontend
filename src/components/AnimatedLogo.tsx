import { useRef, useEffect, memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import gsap from 'gsap';

interface AnimatedLogoProps {
    className?: string;
    size?: number;
    animate?: boolean;
    wireframe?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// SVG PATHS — Extracted exactly from newlogo.svg (viewBox 0 0 375 375)
// ═══════════════════════════════════════════════════════════════════
const PATHS = {
    // Main body: octagonal mane, inner bulb cavity, Y-filament, base socket
    body: "M 247.59375 93.75 L 127.40625 93.75 L 75 146.15625 L 75 238.21875 L 127.40625 290.625 L 131.25 290.625 L 131.25 313.21875 L 146.15625 328.125 L 228.84375 328.125 L 243.75 313.21875 L 243.75 290.625 L 247.59375 290.625 L 300 238.21875 L 300 146.15625 Z M 187.5 305.53125 L 183.65625 309.375 L 153.84375 309.375 L 150 305.53125 L 150 290.625 L 187.5 290.625 Z M 243.75 230.53125 L 202.40625 271.875 L 178.125 271.875 L 178.125 247.59375 L 206.25 219.46875 L 206.25 196.875 L 187.5 196.875 L 187.5 211.78125 L 168.75 230.53125 L 150 211.78125 L 150 196.875 L 131.25 196.875 L 131.25 219.46875 L 159.375 247.59375 L 159.375 271.875 L 135.09375 271.875 L 93.75 230.53125 L 93.75 153.84375 L 135.09375 112.5 L 202.40625 112.5 L 243.75 153.84375 Z M 243.75 230.53125",
    // Top spark — small rectangle
    sparkTop: "M 178.125 46.875 L 196.875 46.875 L 196.875 75 L 178.125 75 Z",
    // Right spark — rotated diamond
    sparkRight: "M 265.246094 96.496094 L 283.996094 77.746094 L 297.253906 91.003906 L 278.503906 109.753906 Z",
    // Left spark — rotated diamond
    sparkLeft: "M 77.746094 91.003906 L 91.003906 77.746094 L 109.753906 96.496094 L 96.496094 109.753906 Z",
} as const;

// ═══════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════
const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (custom: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            delay: custom
        }
    })
};

const drawVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 2, ease: "easeInOut", delay: custom },
            opacity: { duration: 0.3, delay: custom }
        }
    })
};

const sparkVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, delay: 0.8 }
    }
};

const pulseVariants: Variants = {
    animate: {
        opacity: [0.3, 0.6, 0.3],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════
const AnimatedLogo = memo(function AnimatedLogo({
    className = '',
    size = 200,
    animate = true,
    wireframe = false
}: AnimatedLogoProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const glowRef = useRef<SVGCircleElement>(null);
    const floatTween = useRef<gsap.core.Tween | null>(null);
    const pulseTween = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (!animate || !svgRef.current) return;

        floatTween.current = gsap.to(svgRef.current, {
            y: -8,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        if (glowRef.current) {
            pulseTween.current = gsap.to(glowRef.current, {
                opacity: 0.6,
                duration: 1.5,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }

        return () => {
            floatTween.current?.kill();
            pulseTween.current?.kill();
            if (svgRef.current) gsap.set(svgRef.current, { y: 0 });
        };
    }, [animate]);

    const glowStyle = {
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
    };

    return (
        <motion.div
            className={`relative ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ willChange: 'transform' }}
        >
            {/* Ambient glow */}
            <div
                className="absolute inset-0 blur-3xl opacity-30 pointer-events-none"
                style={glowStyle}
            />

            <svg
                ref={svgRef}
                viewBox="0 0 375 375"
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
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer glow circle */}
                <circle
                    ref={glowRef}
                    cx="187.5"
                    cy="187.5"
                    r="160"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="1"
                    opacity="0.3"
                />

                {/* Main body — mane + bulb cavity + filament + base */}
                <motion.path
                    d={PATHS.body}
                    fill={wireframe ? "none" : "#F0F6FC"}
                    stroke={wireframe ? "#F0F6FC" : undefined}
                    strokeWidth={wireframe ? 2.5 : undefined}
                    strokeLinecap={wireframe ? "round" : undefined}
                    strokeLinejoin={wireframe ? "round" : undefined}
                    fillRule="nonzero"
                    filter="url(#glow)"
                    variants={wireframe ? drawVariants : fadeInVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                />

                {/* Sparks */}
                <motion.g variants={sparkVariants} initial="hidden" animate="visible">
                    {/* Top spark */}
                    <path
                        d={PATHS.sparkTop}
                        fill={wireframe ? "none" : "#F0F6FC"}
                        stroke={wireframe ? "#F0F6FC" : undefined}
                        strokeWidth={wireframe ? 2 : undefined}
                        fillRule="nonzero"
                    />
                    {/* Left spark */}
                    <path
                        d={PATHS.sparkLeft}
                        fill={wireframe ? "none" : "#F0F6FC"}
                        stroke={wireframe ? "#F0F6FC" : undefined}
                        strokeWidth={wireframe ? 2 : undefined}
                        fillRule="nonzero"
                    />
                    {/* Right spark */}
                    <path
                        d={PATHS.sparkRight}
                        fill={wireframe ? "none" : "#F0F6FC"}
                        stroke={wireframe ? "#F0F6FC" : undefined}
                        strokeWidth={wireframe ? 2 : undefined}
                        fillRule="nonzero"
                    />
                </motion.g>

                {/* Pulsing accent lines */}
                <motion.g variants={pulseVariants} animate="animate">
                    <line x1="65" y1="120" x2="50" y2="105" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" />
                    <line x1="310" y1="120" x2="325" y2="105" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" />
                </motion.g>
            </svg>

            {/* Hover shadow effect */}
            <div className="absolute inset-0 rounded-full pointer-events-none 
                transition-shadow duration-300 ease-out
                group-hover:shadow-[0_0_60px_rgba(59,130,246,0.4)]"
            />
        </motion.div>
    );
});

export default AnimatedLogo;