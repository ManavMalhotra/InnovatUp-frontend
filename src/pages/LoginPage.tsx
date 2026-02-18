import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  EnvelopeSimple,
  ArrowRight,
  CircleNotch,
  Check,
} from "@phosphor-icons/react";
import AnimatedLogo from "../components/AnimatedLogo";
import OtpVerification from "../components/OtpVerification";
import { useOtp, maskEmail } from "../hooks/useOtp";
import api from "../lib/api";
import axios from "axios";

type LoginStep = "email" | "otp" | "success";

export default function LoginPage() {
  const navigate = useNavigate();

  // ═══════════════════════════════════════
  //  State
  // ═══════════════════════════════════════
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // Shared OTP hook
  const otpState = useOtp();

  // ═══════════════════════════════════════
  //  Auto-focus email input on mount
  // ═══════════════════════════════════════
  useEffect(() => {
    setTimeout(() => emailInputRef.current?.focus(), 400);
  }, []);

  // ═══════════════════════════════════════
  //  Masked Email
  // ═══════════════════════════════════════
  const maskedEmail = maskEmail(email);

  // ═══════════════════════════════════════
  //  Send OTP
  // ═══════════════════════════════════════
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setSendingOtp(true);
    setError("");

    try {
      const otpFormData = new FormData();
      otpFormData.append("email", email);

      const response = await api.post("/send-otp", otpFormData);

      const result = response.data?.result;

      if (result === "email-not-found" || result === "not-registered") {
        setError("This email is not registered. Please sign up first.");
        return;
      }

      setStep("otp");
      otpState.resetOtp();
      otpState.startResendTimer();
      otpState.focusFirstInput(300);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const result = error.response?.data?.result;
        const detail = error.response?.data?.detail;
        const detailMsg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string }) => d.msg).join(", ")
              : null;

        if (
          error.response?.status === 404 ||
          result === "email-not-found" ||
          result === "not-registered"
        ) {
          setError("This email is not registered. Please sign up first.");
        } else if (result === "server-error") {
          setError("Server error. Please try again later.");
        } else {
          setError(detailMsg || "Failed to send OTP. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // ═══════════════════════════════════════
  //  Verify OTP
  // ═══════════════════════════════════════
  const handleVerifyOtp = async () => {
    if (!otpState.isOtpComplete) {
      otpState.setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    otpState.setOtpError("");

    try {
      const verifyFormData = new FormData();
      verifyFormData.append("email", email);
      verifyFormData.append("otp", otpState.otpString);

      const response = await api.post("/login", verifyFormData);

      const result = response.data?.result;

      switch (result) {
        case "otp-verified":
        case "login-succes":
          if (response.data?.token) {
            localStorage.setItem("auth_token", response.data.token);
          }
          localStorage.setItem("user_email", email);
          setStep("success");
          setTimeout(() => navigate("/dashboard"), 2000);
          break;

        case "ok":
          // Admin login — no token, users data comes in response
          sessionStorage.setItem("is_admin", "true");
          sessionStorage.setItem("admin_email", email);
          if (response.data?.users) {
            sessionStorage.setItem("admin_users", JSON.stringify(response.data.users));
          }
          setStep("success");
          setTimeout(() => navigate("/dashboard"), 2000);
          break;

        case "otp-not-verified":
          otpState.setOtpError("Incorrect OTP. Please check and try again.");
          otpState.resetOtp();
          otpState.focusFirstInput();
          break;

        case "no-otp-found":
          otpState.setOtpError("OTP expired or not found. Please request a new one.");
          otpState.resetOtp();
          break;

        case "server-error":
          otpState.setOtpError("Server error. Please try again later.");
          break;

        default:
          otpState.setOtpError("Unexpected response. Please try again.");
          break;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const result = error.response?.data?.result;
        const detail = error.response?.data?.detail;
        const detailMsg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string }) => d.msg).join(", ")
              : null;

        if (result === "otp-not-verified") {
          otpState.setOtpError("Incorrect OTP. Please check and try again.");
        } else if (result === "no-otp-found") {
          otpState.setOtpError("OTP expired or not found. Please request a new one.");
        } else if (result === "server-error") {
          otpState.setOtpError("Server error. Please try again later.");
        } else {
          otpState.setOtpError(detailMsg || "Verification failed. Please try again.");
        }

        otpState.resetOtp();
        otpState.focusFirstInput();
      } else {
        otpState.setOtpError("Something went wrong. Please try again.");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = () => {
    if (otpState.resendTimer > 0) return;
    handleSendOtp();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendOtp();
  };

  // ═══════════════════════════════════════
  //  Success Screen
  // ═══════════════════════════════════════
  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-background">
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="mb-3 text-2xl font-bold font-display text-foreground">
            Welcome Back!
          </h2>
          <p className="mb-2 body-text">Login successful.</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to your dashboard...
          </p>

          {/* Loading dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  //  Main Render
  // ═══════════════════════════════════════
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-8">
          <AnimatedLogo size={40} animate={false} />
          <span className="text-xl font-bold font-display text-foreground">
            Innovat<span className="text-primary">Up</span>
          </span>
        </Link>

        {/* Glass Card */}
        <div className="p-6 border bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl sm:p-8">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 text-2xl font-bold font-display text-foreground">
              Welcome <span className="text-gradient">Back</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Login with your registered email to access your dashboard.
            </p>
          </motion.div>

          {/* ═══════════════════════════════════ */}
          {/*  Animated Step Container            */}
          {/* ═══════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {/* EMAIL STEP */}
            {step === "email" && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-muted-foreground">
                      Email address
                    </label>
                    <div className="relative">
                      <EnvelopeSimple
                        className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground"
                        weight="duotone"
                      />
                      <input
                        ref={emailInputRef}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendOtp();
                          }
                        }}
                        className="w-full py-4 pl-12 pr-4 transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder="you@college.edu"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 text-sm text-center text-red-400 border rounded-lg bg-red-500/5 border-red-500/20"
                    >
                      {error}
                      {error.includes("not registered") && (
                        <Link
                          to="/register"
                          className="block mt-1 font-medium underline text-primary hover:text-primary/80"
                        >
                          Register here →
                        </Link>
                      )}
                    </motion.div>
                  )}

                  {/* Info text */}
                  <p className="text-xs text-center text-muted-foreground/70">
                    A 6-digit code will be sent to your email. Expires in 10 minutes.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sendingOtp || !email.trim()}
                    className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sendingOtp ? (
                      <span className="flex items-center justify-center gap-2">
                        <CircleNotch className="w-5 h-5 animate-spin" />
                        Sending OTP...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Verification Code
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* OTP VERIFICATION STEP — now uses shared component */}
            {step === "otp" && (
              <OtpVerification
                key="otp-step"
                otpState={otpState}
                maskedEmail={maskedEmail}
                verifying={verifyingOtp}
                sendingOtp={sendingOtp}
                onVerify={handleVerifyOtp}
                onBack={() => {
                  setStep("email");
                  otpState.resetOtp();
                }}
                onResend={handleResendOtp}
                verifyLabel="Verify & Login"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Register link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
