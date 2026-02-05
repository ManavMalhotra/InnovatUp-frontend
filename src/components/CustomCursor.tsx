import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [cursorText, setCursorText] = useState('');
    const cursorRef = useRef<HTMLDivElement>(null);

    const cursorX = useMotionValue(-50);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Only show custom cursor on desktop with mouse
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements
            const isButton = target.closest('button, a, [role="button"]');
            const isInput = target.closest('input, textarea, select');
            const hasDataCursor = target.closest('[data-cursor]');

            if (hasDataCursor) {
                const cursorData = (hasDataCursor as HTMLElement).getAttribute('data-cursor');
                setCursorText(cursorData || '');
                setIsHovering(true);
            } else if (isButton || isInput) {
                setIsHovering(true);
                setCursorText('');
            } else {
                setIsHovering(false);
                setCursorText('');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        // Add cursor-none to body
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.style.cursor = 'auto';
        };
    }, [cursorX, cursorY]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return null;
    }

    return (
        <>
            {/* Main cursor */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Outer ring */}
                    <motion.div
                        className="w-10 h-10 rounded-full border-2 border-white"
                        animate={{
                            scale: isHovering ? 1.2 : 1,
                            opacity: isHovering ? 0.5 : 0.3,
                        }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Inner dot */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
                        animate={{
                            scale: isHovering ? 0 : 1,
                        }}
                        transition={{ duration: 0.15 }}
                    />

                    {/* Cursor text */}
                    {cursorText && (
                        <motion.span
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-white whitespace-nowrap"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            {cursorText}
                        </motion.span>
                    )}
                </motion.div>
            </motion.div>

            {/* Cursor trail/glow */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
            >
                <motion.div
                    className="w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    }}
                    animate={{
                        scale: isHovering ? 1.5 : 1,
                        opacity: isHovering ? 0.8 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </>
    );
}
