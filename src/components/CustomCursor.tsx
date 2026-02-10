import { useEffect, useState, useRef, useCallback } from 'react';
import {
    motion,
    useMotionValue,
    useSpring,
    AnimatePresence,
} from 'motion/react';

// ─── Configuration ──────────────────────────────────────────
const RING_SIZE = 40;
const DOT_SIZE = 6;
const GLOW_SIZE = 120;

type CursorMode = 'default' | 'hover' | 'text';

interface ClickRipple {
    id: number;
    x: number;
    y: number;
}

export default function CustomCursor() {
    const [mode, setMode] = useState<CursorMode>('default');
    const [isPressed, setIsPressed] = useState(false);
    const [cursorLabel, setCursorLabel] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [hasMouse, setHasMouse] = useState(false);
    const [ripples, setRipples] = useState<ClickRipple[]>([]);

    const rippleId = useRef(0);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    // ─── Raw mouse position (dot follows this directly) ───────
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // ─── Ring follows with a pleasing spring lag ──────────────
    const ringX = useSpring(mouseX, { damping: 20, stiffness: 250, mass: 0.5 });
    const ringY = useSpring(mouseY, { damping: 20, stiffness: 250, mass: 0.5 });

    // ─── Glow trails even more lazily ─────────────────────────
    const glowX = useSpring(mouseX, { damping: 35, stiffness: 120, mass: 1.2 });
    const glowY = useSpring(mouseY, { damping: 35, stiffness: 120, mass: 1.2 });

    // ─── Click ripple spawner ─────────────────────────────────
    const spawnRipple = useCallback((x: number, y: number) => {
        const id = ++rippleId.current;
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 800);
    }, []);

    // ─── Main setup effect ───────────────────────────────────
    useEffect(() => {
        // Detect real pointer device (works on hybrid touch+mouse laptops)
        const pointerQuery = window.matchMedia('(pointer: fine)');
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (!pointerQuery.matches || motionQuery.matches) return;

        setHasMouse(true);
        let hasMoved = false;

        const onMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!hasMoved) {
                hasMoved = true;
                setIsVisible(true);
            }
        };

        const onDown = (e: MouseEvent) => {
            setIsPressed(true);
            spawnRipple(e.clientX, e.clientY);
        };

        const onUp = () => setIsPressed(false);

        const onOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // data-cursor="Label" for custom labels
            const dataCursor = target.closest('[data-cursor]');
            if (dataCursor) {
                setCursorLabel(dataCursor.getAttribute('data-cursor') || '');
                setMode('hover');
                return;
            }

            // Text inputs → morphs to blinking caret
            const textInput = target.closest(
                'input:not([type="button"]):not([type="submit"]):not([type="reset"])' +
                ':not([type="checkbox"]):not([type="radio"]):not([type="range"])' +
                ':not([type="file"]):not([type="color"])' +
                ', textarea, [contenteditable="true"]'
            );
            if (textInput) {
                setMode('text');
                setCursorLabel('');
                return;
            }

            // Buttons / links / interactive
            const interactive = target.closest(
                'button, a, [role="button"], [tabindex]:not([tabindex="-1"]),' +
                'select, summary, label, video, [data-cursor-hover]'
            );
            if (interactive) {
                setMode('hover');
                setCursorLabel('');
                return;
            }

            setMode('default');
            setCursorLabel('');
        };

        const onLeave = () => setIsVisible(false);
        const onEnter = () => {
            if (hasMoved) setIsVisible(true);
        };

        // Passive for perf on high-frequency events
        document.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mousedown', onDown);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('mouseover', onOver, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave);
        document.documentElement.addEventListener('mouseenter', onEnter);

        // Hide native cursor on ALL elements (Safari/Firefox need this)
        const style = document.createElement('style');
        style.id = 'custom-cursor-hide';
        style.textContent =
            'html,html *,html *::before,html *::after{cursor:none!important}';
        document.head.appendChild(style);
        styleRef.current = style;

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('mouseover', onOver);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            document.documentElement.removeEventListener('mouseenter', onEnter);
            if (styleRef.current && document.head.contains(styleRef.current)) {
                document.head.removeChild(styleRef.current);
                styleRef.current = null;
            }
        };
    }, [mouseX, mouseY, spawnRipple]);

    // SSR-safe: hasMouse only set in useEffect
    if (!hasMouse) return null;

    const isHover = mode === 'hover';
    const isText = mode === 'text';

    return (
        <>
            {/* ═══════════ 1. CLICK RIPPLES ═══════════════════════ */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        aria-hidden="true"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            x: ripple.x,
                            y: ripple.y,
                            pointerEvents: 'none',
                            zIndex: 100001,
                        }}
                    >
                        {/* Primary ripple ring */}
                        <motion.div
                            style={{
                                width: RING_SIZE,
                                height: RING_SIZE,
                                marginLeft: -(RING_SIZE / 2),
                                marginTop: -(RING_SIZE / 2),
                                borderRadius: '50%',
                                border: '2px solid rgba(255, 255, 255, 0.7)',
                                mixBlendMode: 'difference',
                            }}
                            initial={{ scale: 0.3, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                        {/* Secondary softer ripple (delayed) */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: RING_SIZE,
                                height: RING_SIZE,
                                marginLeft: -(RING_SIZE / 2),
                                marginTop: -(RING_SIZE / 2),
                                borderRadius: '50%',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                mixBlendMode: 'difference',
                            }}
                            initial={{ scale: 0.5, opacity: 1 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.08,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* ═══════════ 2. OUTER RING (spring-delayed) ═════════ */}
            <motion.div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: ringX,
                    y: ringY,
                    pointerEvents: 'none',
                    zIndex: 99999,
                    mixBlendMode: 'difference',
                    willChange: 'transform',
                }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.15 }}
            >
                <motion.div
                    style={{
                        width: RING_SIZE,
                        height: RING_SIZE,
                        marginLeft: -(RING_SIZE / 2),
                        marginTop: -(RING_SIZE / 2),
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    animate={{
                        scale: isPressed ? 0.65 : isHover ? 1.6 : isText ? 0.5 : 1,
                    }}
                    transition={{
                        type: 'spring',
                        // Tight snap on press, bouncy release
                        damping: isPressed ? 30 : 12,
                        stiffness: isPressed ? 500 : 200,
                        mass: 0.3,
                    }}
                >
                    {/* Ring border */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: '1.5px solid white',
                        }}
                        animate={{
                            opacity: isText ? 0 : isHover ? 1 : 0.5,
                            borderWidth: isHover ? 2 : 1.5,
                        }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    />

                    {/* Hover fill glow (inside ring) */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 2,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            backdropFilter: 'blur(1px)',
                            WebkitBackdropFilter: 'blur(1px)',
                        }}
                        animate={{
                            scale: isHover ? 1 : 0,
                            opacity: isHover ? 1 : 0,
                        }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 300,
                        }}
                    />

                    {/* Hover arrow indicator */}
                    <AnimatePresence>
                        {isHover && !cursorLabel && (
                            <motion.div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                animate={{ scale: 1, opacity: 0.8, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                transition={{
                                    type: 'spring',
                                    damping: 18,
                                    stiffness: 300,
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Text cursor caret (blinking) */}
                    <AnimatePresence>
                        {isText && (
                            <motion.div
                                style={{
                                    width: 2,
                                    height: 28,
                                    backgroundColor: 'white',
                                    borderRadius: 1,
                                }}
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{
                                    scaleY: 1,
                                    opacity: [1, 1, 0.2, 0.2],
                                }}
                                exit={{ scaleY: 0, opacity: 0 }}
                                transition={{
                                    scaleY: {
                                        type: 'spring',
                                        damping: 20,
                                        stiffness: 300,
                                    },
                                    opacity: {
                                        duration: 1,
                                        repeat: Infinity,
                                        times: [0, 0.45, 0.5, 1],
                                        ease: 'linear',
                                    },
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Custom label text */}
                    <AnimatePresence mode="wait">
                        {cursorLabel && (
                            <motion.span
                                key={cursorLabel}
                                style={{
                                    position: 'absolute',
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    whiteSpace: 'nowrap',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}
                                initial={{ opacity: 0, scale: 0.4, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6, y: -6 }}
                                transition={{
                                    type: 'spring',
                                    damping: 22,
                                    stiffness: 300,
                                }}
                            >
                                {cursorLabel}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            {/* ═══════════ 3. INNER DOT (instant tracking) ════════ */}
            <motion.div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: mouseX,
                    y: mouseY,
                    pointerEvents: 'none',
                    zIndex: 100000,
                    mixBlendMode: 'difference',
                    willChange: 'transform',
                }}
                animate={{
                    opacity: isVisible && !isHover && !isText ? 1 : 0,
                }}
                transition={{ duration: 0.12 }}
            >
                <motion.div
                    style={{
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        marginLeft: -(DOT_SIZE / 2),
                        marginTop: -(DOT_SIZE / 2),
                        borderRadius: '50%',
                        backgroundColor: 'white',
                    }}
                    animate={{
                        scale: isPressed ? 3 : 1,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 10,
                        stiffness: 400,
                        mass: 0.2,
                    }}
                />
            </motion.div>

            {/* ═══════════ 4. AMBIENT GLOW (slowest trail) ════════ */}
            <motion.div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: glowX,
                    y: glowY,
                    pointerEvents: 'none',
                    zIndex: 99997,
                    willChange: 'transform',
                }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    style={{
                        width: GLOW_SIZE,
                        height: GLOW_SIZE,
                        marginLeft: -(GLOW_SIZE / 2),
                        marginTop: -(GLOW_SIZE / 2),
                        borderRadius: '50%',
                        background:
                            'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 45%, transparent 70%)',
                    }}
                    animate={{
                        scale: isPressed ? 0.5 : isHover ? 1.8 : 1,
                        opacity: isPressed ? 1 : isHover ? 0.9 : 0.4,
                    }}
                    transition={{
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                />
            </motion.div>
        </>
    );
}