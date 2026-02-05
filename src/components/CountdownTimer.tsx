import { useState, useEffect } from 'react';
import { siteConfig } from '../data/siteConfig';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    });

    useEffect(() => {
        const targetDate = new Date(siteConfig.dates.eventStart).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isExpired: true,
                };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
                isExpired: false,
            };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (timeLeft.isExpired) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="label-mono text-primary">Event Live Now!</span>
            </div>
        );
    }

    const timeBlocks = [
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {timeBlocks.map((block, index) => (
                <div key={block.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden">
                                <span
                                    className="font-display font-bold text-xl sm:text-2xl text-foreground tabular-nums"
                                    style={{ fontVariantNumeric: 'tabular-nums' }}
                                >
                                    {String(block.value).padStart(2, '0')}
                                </span>
                            </div>
                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 rounded-lg bg-primary/5 pointer-events-none" />
                        </div>
                        <span className="label-mono text-muted-foreground mt-1 text-[10px] sm:text-xs">
                            {block.label}
                        </span>
                    </div>
                    {index < timeBlocks.length - 1 && (
                        <span className="text-muted-foreground font-bold mx-0.5 sm:mx-1 text-lg sm:text-xl mb-4">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}
