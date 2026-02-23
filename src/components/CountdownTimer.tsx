import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { siteConfig } from '../data/siteConfig';

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS - Moved outside component to prevent recreation
// ═══════════════════════════════════════════════════════════════════
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

const TIME_UNITS = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hrs' },
    { key: 'minutes', label: 'Min' },
    { key: 'seconds', label: 'Sec' },
] as const;

type TimeUnitKey = typeof TIME_UNITS[number]['key'];

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════
interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

interface TimeBlockProps {
    value: number;
    label: string;
    isLast: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTION - Pure function, no dependencies
// ═══════════════════════════════════════════════════════════════════
const calculateTimeLeft = (targetTimestamp: number): TimeLeft => {
    const difference = targetTimestamp - Date.now();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
        days: Math.floor(difference / MS_PER_DAY),
        hours: Math.floor((difference % MS_PER_DAY) / MS_PER_HOUR),
        minutes: Math.floor((difference % MS_PER_HOUR) / MS_PER_MINUTE),
        seconds: Math.floor((difference % MS_PER_MINUTE) / MS_PER_SECOND),
        isExpired: false,
    };
};

// ═══════════════════════════════════════════════════════════════════
// CUSTOM HOOK - Encapsulates all countdown logic
// ═══════════════════════════════════════════════════════════════════
const useCountdown = (targetDate: string) => {
    const targetTimestamp = useMemo(
        () => new Date(targetDate).getTime(),
        [targetDate]
    );

    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    });

    // Using ref to store interval ID prevents stale closure issues
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Handle hydration mismatch by only calculating after mount
    useEffect(() => {
        setIsMounted(true);
        setTimeLeft(calculateTimeLeft(targetTimestamp));
    }, [targetTimestamp]);

    useEffect(() => {
        // Don't start interval until mounted or if already expired
        if (!isMounted || timeLeft.isExpired) return;

        const updateTimer = () => {
            const newTimeLeft = calculateTimeLeft(targetTimestamp);
            setTimeLeft(newTimeLeft);

            // Auto-cleanup when expired
            if (newTimeLeft.isExpired && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        intervalRef.current = setInterval(updateTimer, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [targetTimestamp, isMounted, timeLeft.isExpired]);

    return { timeLeft, isMounted };
};

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS - Memoized to prevent unnecessary re-renders
// ═══════════════════════════════════════════════════════════════════

/** Individual time block display */
const TimeBlock = memo<TimeBlockProps>(({ value, label, isLast }) => (
    <div className="flex items-center">
        <div className="flex flex-col items-center">
            <div className="relative">
                <div className="w-11 sm:w-16 h-11 sm:h-16 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden">
                    <span className="font-display font-bold text-lg sm:text-2xl text-foreground tabular-nums">
                        {String(value).padStart(2, '0')}
                    </span>
                </div>
                {/* Subtle glow effect */}
                <div
                    className="absolute inset-0 rounded-lg bg-primary/5 pointer-events-none"
                    aria-hidden="true"
                />
            </div>
            <span className="label-mono text-muted-foreground mt-1 text-[10px] sm:text-xs">
                {label}
            </span>
        </div>
        {!isLast && (
            <span
                className="text-muted-foreground font-bold mx-0.5 sm:mx-1 text-lg sm:text-xl mb-4"
                aria-hidden="true"
            >
                :
            </span>
        )}
    </div>
));
TimeBlock.displayName = 'TimeBlock';

/** Live event indicator with pulsing animation */
const LiveIndicator = memo(() => (
    <div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30"
        role="status"
        aria-live="polite"
    >
        <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="label-mono text-primary">Event Live Now!</span>
    </div>
));
LiveIndicator.displayName = 'LiveIndicator';

/** Loading skeleton for SSR hydration */
const CountdownSkeleton = memo(() => (
    <div className="flex items-center gap-1 sm:gap-2" aria-label="Loading countdown...">
        {TIME_UNITS.map(({ key, label }, index) => (
            <div key={key} className="flex items-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg bg-card border border-border flex items-center justify-center">
                        <span className="font-display font-bold text-xl sm:text-2xl text-muted-foreground/50">
                            --
                        </span>
                    </div>
                    <span className="label-mono text-muted-foreground mt-1 text-[10px] sm:text-xs">
                        {label}
                    </span>
                </div>
                {index < TIME_UNITS.length - 1 && (
                    <span className="text-muted-foreground font-bold mx-0.5 sm:mx-1 text-lg sm:text-xl mb-4">
                        :
                    </span>
                )}
            </div>
        ))}
    </div>
));
CountdownSkeleton.displayName = 'CountdownSkeleton';

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function CountdownTimer() {
    const { timeLeft, isMounted } = useCountdown(siteConfig.dates.eventStart);

    // Prevent hydration mismatch - show skeleton during SSR
    if (!isMounted) {
        return <CountdownSkeleton />;
    }

    if (timeLeft.isExpired) {
        return <LiveIndicator />;
    }

    // Create accessible time string
    const ariaLabel = `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`;

    return (
        <div
            className="flex items-center gap-1 sm:gap-2"
            role="timer"
            aria-live="off" // Prevent screen reader spam
            aria-label={ariaLabel}
        >
            {TIME_UNITS.map(({ key, label }, index) => (
                <TimeBlock
                    key={key}
                    value={timeLeft[key as TimeUnitKey]}
                    label={label}
                    isLast={index === TIME_UNITS.length - 1}
                />
            ))}
        </div>
    );
}