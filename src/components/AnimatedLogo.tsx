import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';

interface AnimatedLogoProps {
    className?: string;
    size?: number;
    animate?: boolean;
}

/**
 * Animated SVG version of the InnovatUp lightbulb-lion logo
 * Falls back gracefully without WebGL
 */
export default function AnimatedLogo({ className = '', size = 200, animate = true }: AnimatedLogoProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const glowRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        if (!animate || !svgRef.current) return;

        const ctx = gsap.context(() => {
            // Gentle floating animation
            gsap.to(svgRef.current, {
                y: -8,
                duration: 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            // Pulsing glow
            if (glowRef.current) {
                gsap.to(glowRef.current, {
                    opacity: 0.6,
                    scale: 1.1,
                    duration: 1.5,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    transformOrigin: 'center center',
                });
            }
        }, svgRef);

        return () => ctx.revert();
    }, [animate]);

    return (
        <motion.div
            className={`relative ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {/* Glow effect behind logo */}
            <div
                className="absolute inset-0 blur-3xl opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                }}
            />

            <svg
                ref={svgRef}
                viewBox="0 0 200 200"
                width={size}
                height={size}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
            >
                {/* Definitions */}
                <defs>
                    {/* Gradient for main shape */}
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#58A6FF" />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background glow circle */}
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

                {/* Outer octagonal frame - Lion's mane */}
                <motion.path
                    d="M100 25 L155 50 L175 100 L155 150 L100 175 L45 150 L25 100 L45 50 Z"
                    stroke="#F0F6FC"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                />

                {/* Inner lightbulb shape */}
                <motion.path
                    d="M100 45 L130 60 L140 100 L130 130 L110 145 L90 145 L70 130 L60 100 L70 60 Z"
                    stroke="#F0F6FC"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
                />

                {/* Y-shaped filament inside bulb */}
                <motion.path
                    d="M100 80 L100 110 M100 110 L85 130 M100 110 L115 130"
                    stroke="#F0F6FC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.6 }}
                />

                {/* Bulb base */}
                <motion.rect
                    x="85"
                    y="145"
                    width="30"
                    height="12"
                    rx="2"
                    stroke="#F0F6FC"
                    strokeWidth="2"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1 }}
                />

                {/* Spark diamonds */}
                <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                >
                    {/* Top spark */}
                    <path
                        d="M100 15 L103 20 L100 25 L97 20 Z"
                        fill="#F0F6FC"
                    />
                    {/* Top left spark */}
                    <path
                        d="M55 40 L60 42 L55 48 L52 42 Z"
                        fill="#F0F6FC"
                    />
                    {/* Top right spark */}
                    <path
                        d="M145 40 L150 42 L145 48 L142 42 Z"
                        fill="#F0F6FC"
                    />
                </motion.g>

                {/* Animated light rays (subtle) */}
                <motion.g
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <line x1="35" y1="55" x2="25" y2="45" stroke="#58A6FF" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="165" y1="55" x2="175" y2="45" stroke="#58A6FF" strokeWidth="1.5" strokeLinecap="round" />
                </motion.g>
            </svg>

            {/* Interactive hover glow */}
            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                whileHover={{
                    boxShadow: '0 0 60px rgba(59, 130, 246, 0.4)',
                }}
            />
        </motion.div>
    );
}
