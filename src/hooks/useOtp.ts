import { useState, useEffect, useRef, useCallback } from 'react';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export interface UseOtpOptions {
    /** Called when the OTP timer expires or OTP is cleared */
    onOtpReset?: () => void;
}

export interface UseOtpReturn {
    otp: string[];
    resendTimer: number;
    otpInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    otpString: string;
    isOtpComplete: boolean;
    handleOtpChange: (index: number, value: string) => void;
    handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleOtpPaste: (e: React.ClipboardEvent, startIndex: number) => void;
    resetOtp: () => void;
    startResendTimer: () => void;
    focusFirstInput: (delayMs?: number) => void;
    setOtpError: (error: string) => void;
    otpError: string;
}

/**
 * Shared hook for OTP input handling, used by both LoginPage and RegistrationPage.
 * Manages OTP state, input refs, resend timer, and input event handlers.
 */
export function useOtp(options: UseOtpOptions = {}): UseOtpReturn {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [resendTimer, setResendTimer] = useState(0);
    const [otpError, setOtpError] = useState('');
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const resetOtp = useCallback(() => {
        setOtp(Array(OTP_LENGTH).fill(''));
        setOtpError('');
        options.onOtpReset?.();
    }, [options]);

    const focusFirstInput = useCallback((delayMs = 100) => {
        setTimeout(() => otpInputRefs.current[0]?.focus(), delayMs);
    }, []);

    const startResendTimer = useCallback(() => {
        setResendTimer(RESEND_COOLDOWN_SECONDS);
    }, []);

    const handleOtpChange = useCallback((index: number, value: string) => {
        if (value && !/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setOtpError('');
        if (value && index < OTP_LENGTH - 1) {
            otpInputRefs.current[index + 1]?.focus();
        }
    }, [otp]);

    const handleOtpKeyDown = useCallback(
        (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                otpInputRefs.current[index - 1]?.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        },
        [otp],
    );

    const handleOtpPaste = useCallback(
        (e: React.ClipboardEvent, startIndex: number) => {
            e.preventDefault();
            const pastedData = e.clipboardData
                .getData('text')
                .replace(/\D/g, '')
                .slice(0, OTP_LENGTH);
            if (pastedData) {
                const newOtp = [...otp];
                for (let i = 0; i < pastedData.length && startIndex + i < OTP_LENGTH; i++) {
                    newOtp[startIndex + i] = pastedData[i];
                }
                setOtp(newOtp);
                const nextIndex = Math.min(startIndex + pastedData.length, OTP_LENGTH - 1);
                otpInputRefs.current[nextIndex]?.focus();
            }
        },
        [otp],
    );

    const otpString = otp.join('');
    const isOtpComplete = otpString.length === OTP_LENGTH;

    return {
        otp,
        resendTimer,
        otpInputRefs,
        otpString,
        isOtpComplete,
        handleOtpChange,
        handleOtpKeyDown,
        handleOtpPaste,
        resetOtp,
        startResendTimer,
        focusFirstInput,
        setOtpError,
        otpError,
    };
}

/**
 * Mask an email address for display (e.g. "ma••••@gmail.com").
 */
export function maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) return email;
    const [local, domain] = parts;
    const visible = local.slice(0, 2);
    return `${visible}${'•'.repeat(Math.max(local.length - 2, 0))}@${domain}`;
}
