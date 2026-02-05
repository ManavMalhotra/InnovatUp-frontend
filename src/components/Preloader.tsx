import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedLogo from './AnimatedLogo';

interface PreloaderProps {
    onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        // Minimum display time for preloader
        const timer = setTimeout(() => {
            setIsLoading(false);
            onComplete?.();
        }, 1800);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center"
                >
                    {/* Animated logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AnimatedLogo size={120} animate={true} />
                    </motion.div>

                    {/* Brand name */}
                    <motion.h1
                        className="font-display font-bold text-2xl mt-6 text-foreground"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Innovat<span className="text-primary">Up</span>
                    </motion.h1>

                    {/* Loading bar */}
                    <motion.div
                        className="mt-8 w-48 h-1 bg-card rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </motion.div>

                    {/* Loading text */}
                    <motion.span
                        className="label-mono text-muted-foreground mt-4 text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Loading experience...
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
