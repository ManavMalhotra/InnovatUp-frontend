import { Fragment } from 'react';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    ArrowClockwise,
    CircleNotch,
    ShieldCheck,
    EnvelopeOpen,
} from '@phosphor-icons/react';
import type { UseOtpReturn } from '../hooks/useOtp';

interface OtpVerificationProps {
    /** The useOtp hook return value */
    otpState: UseOtpReturn;
    /** Masked email to display */
    maskedEmail: string;
    /** Whether the verify request is in flight */
    verifying: boolean;
    /** Whether the send-OTP request is in flight (for resend button) */
    sendingOtp: boolean;
    /** Called when the user clicks "Verify" */
    onVerify: () => void;
    /** Called when the user clicks "Back" or "Change Email" */
    onBack: () => void;
    /** Called when the user clicks "Resend OTP" */
    onResend: () => void;
    /** Label for the back button (defaults to "Back") */
    backLabel?: string;
    /** Label for the verify button (defaults to "Verify & Login") */
    verifyLabel?: string;
    /** Title text (defaults to "Check Your Inbox") */
    title?: string;
    /** Subtitle text (defaults to "Enter the 6-digit code sent to") */
    subtitle?: string;
}

/**
 * Shared OTP verification UI component.
 * Renders the icon, title, OTP input boxes, resend timer/button, error display,
 * and action buttons. Used by both LoginPage and RegistrationPage.
 */
export default function OtpVerification({
    otpState,
    maskedEmail,
    verifying,
    sendingOtp,
    onVerify,
    onBack,
    onResend,
    backLabel = 'Back',
    verifyLabel = 'Verify & Login',
    title = 'Check Your Inbox',
    subtitle = 'Enter the 6-digit code sent to',
}: OtpVerificationProps) {
    const {
        otp,
        resendTimer,
        otpInputRefs,
        isOtpComplete,
        handleOtpChange,
        handleOtpKeyDown,
        handleOtpPaste,
        otpError,
    } = otpState;

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Icon & Title */}
            <div className="text-center">
                <motion.div
                    className="flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                >
                    <EnvelopeOpen weight="duotone" className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="mb-2 text-xl font-bold font-display text-foreground">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{maskedEmail}</p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                    <Fragment key={index}>
                        {index === 3 && (
                            <span className="text-xl font-bold text-muted-foreground/40">–</span>
                        )}
                        <motion.input
                            ref={(el) => {
                                otpInputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => {
                                handleOtpKeyDown(index, e);
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onVerify();
                                }
                            }}
                            onPaste={(e) => handleOtpPaste(e, index)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-display
                border-2 rounded-xl transition-all duration-200
                bg-card text-foreground
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                ${digit ? 'border-primary/50 bg-primary/5' : 'border-border'}
                ${otpError ? 'border-red-400/50' : ''}
              `}
                        />
                    </Fragment>
                ))}
            </div>

            {/* Error Message */}
            {otpError && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-center text-red-400"
                >
                    {otpError}
                </motion.p>
            )}

            {/* Resend Timer / Button */}
            <div className="text-center">
                {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Resend code in{' '}
                        <span className="font-mono font-medium text-foreground">
                            {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:
                            {String(resendTimer % 60).padStart(2, '0')}
                        </span>
                    </p>
                ) : (
                    <button
                        type="button"
                        onClick={onResend}
                        disabled={sendingOtp}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                    >
                        {sendingOtp ? (
                            <CircleNotch className="w-4 h-4 animate-spin" />
                        ) : (
                            <ArrowClockwise className="w-4 h-4" />
                        )}
                        Resend OTP
                    </button>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button type="button" onClick={onBack} className="flex-1 btn-secondary">
                    <span className="flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        {backLabel}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={onVerify}
                    disabled={verifying || !isOtpComplete}
                    className="flex-1 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {verifying ? (
                        <span className="flex items-center justify-center gap-2">
                            <CircleNotch className="w-5 h-5 animate-spin" />
                            Verifying...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            {verifyLabel}
                        </span>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
