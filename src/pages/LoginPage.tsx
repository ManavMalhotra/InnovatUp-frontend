import { useState, useEffect, useRef, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  EnvelopeSimple,
  EnvelopeOpen,
  ShieldCheck,
  ArrowClockwise,
  CircleNotch,
  Check,
  ArrowRight,
  SignIn,
  Sparkle,
} from "@phosphor-icons/react";
import AnimatedLogo from "../components/AnimatedLogo";
import axios from "axios";

type LoginStep = "email" | "otp" | "success";

export default function LoginPage() {
  const navigate = useNavigate();

  // ═══════════════════════════════════════
  //  State
  // ═══════════════════════════════════════
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // ═══════════════════════════════════════
  //  Auto-focus email input on mount
  // ═══════════════════════════════════════
  useEffect(() => {
    setTimeout(() => emailInputRef.current?.focus(), 400);
  }, []);

  // ═══════════════════════════════════════
  //  Resend Timer Countdown
  // ═══════════════════════════════════════
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // ═══════════════════════════════════════
  //  OTP Input Handlers
  // ═══════════════════════════════════════
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent, startIndex: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && startIndex + i < 6; i++) {
        newOtp[startIndex + i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(startIndex + pastedData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  // ═══════════════════════════════════════
  //  Masked Email
  // ═══════════════════════════════════════
  const maskedEmail = (() => {
    const parts = email.split("@");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return email;
    const [local, domain] = parts;
    const visible = local.slice(0, 2);
    return `${visible}${"•".repeat(Math.max(local.length - 2, 0))}@${domain}`;
  })();

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
      const baseURL = import.meta.env.VITE_BACKEND_URL;

      // ✅ FormData — matches your backend expectation
      const otpFormData = new FormData();
      otpFormData.append("email", email);

      const response = await axios.post(
        `${baseURL?.replace(/\/$/, "")}/send-otp`,
        otpFormData,
      );

      const result = response.data?.result;

      if (result === "email-not-found" || result === "not-registered") {
        setError("This email is not registered. Please sign up first.");
        return;
      }

      setStep("otp");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 300);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const result = error.response?.data?.result;
        const detail = error.response?.data?.detail;

        if (
          error.response?.status === 404 ||
          result === "email-not-found" ||
          result === "not-registered"
        ) {
          setError("This email is not registered. Please sign up first.");
        } else if (result === "server-error") {
          setError("Server error. Please try again later.");
        } else {
          setError(detail || "Failed to send OTP. Please try again.");
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
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    setError("");

    try {
      const baseURL = import.meta.env.VITE_BACKEND_URL;

      // ✅ FormData — matches your backend expectation
      const verifyFormData = new FormData();
      verifyFormData.append("email", email);
      verifyFormData.append("otp", otpString);

      const response = await axios.post(
        `${baseURL?.replace(/\/$/, "")}/login`,
        verifyFormData,
      );

      const result = response.data?.result;

      switch (result) {
        case "otp-verified":
        case "login-succes":
          // Store token if backend returns one
          if (response.data?.token) {
            localStorage.setItem("auth_token", response.data.token);
          }
          // Store email for dashboard use
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
          setError("Incorrect OTP. Please check and try again.");
          setOtp(["", "", "", "", "", ""]);
          setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
          break;

        case "no-otp-found":
          setError("OTP expired or not found. Please request a new one.");
          setOtp(["", "", "", "", "", ""]);
          setResendTimer(0);
          break;

        case "server-error":
          setError("Server error. Please try again later.");
          break;

        default:
          setError("Unexpected response. Please try again.");
          break;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const result = error.response?.data?.result;
        const detail = error.response?.data?.detail;

        if (result === "otp-not-verified") {
          setError("Incorrect OTP. Please check and try again.");
        } else if (result === "no-otp-found") {
          setError("OTP expired or not found. Please request a new one.");
          setResendTimer(0);
        } else if (result === "server-error") {
          setError("Server error. Please try again later.");
        } else {
          setError(detail || "Verification failed. Please try again.");
        }

        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
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
          <h2 className="mb-3 headline-lg font-display text-foreground">
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
    <div className="flex items-center justify-center min-h-screen px-6 py-20 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-6">
          <AnimatedLogo size={40} animate={false} />
          <span className="text-xl font-bold font-display text-foreground">
            Innovat<span className="text-primary">Up</span>
          </span>
        </Link>

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 headline-lg font-display text-foreground">
            Welcome <span className="text-gradient">Back</span>
          </h1>
          <p className="body-text">
            Login with your registered email to access your dashboard.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          <motion.div
            className="flex-1 h-1 rounded-full bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step === "otp" ? "bg-primary" : "bg-border"
              }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1 }}
          />
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => {
              if (step === "otp") {
                setStep("email");
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }
            }}
            className={`label-mono text-xs transition-colors ${step === "email"
              ? "text-primary"
              : "text-primary cursor-pointer hover:text-primary/80"
              }`}
          >
            Email
          </button>
          <span
            className={`label-mono text-xs transition-colors ${step === "otp" ? "text-primary" : "text-muted-foreground"
              }`}
          >
            Verify
          </span>
        </div>

        {/* ═══════════════════════════════════ */}
        {/*  Animated Step Container            */}
        {/* ═══════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {/* ╔═══════════════════════════════╗ */}
          {/* ║  EMAIL STEP                   ║ */}
          {/* ╚═══════════════════════════════╝ */}
          {step === "email" && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                {/* Decorative Icon */}
                <div className="flex justify-center mb-2">
                  <motion.div
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    <SignIn weight="duotone" className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>

                <h2 className="text-xl font-bold text-center font-display text-foreground">
                  Enter Your Email
                </h2>
                <p className="text-sm text-center text-muted-foreground">
                  We'll send a verification code to your registered email
                </p>

                {/* Email Input */}
                <div>
                  <label className="block mb-2 label-mono text-muted-foreground">
                    Registered Email
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

                {/* Info text */}
                <div className="flex items-start gap-2 p-3 border rounded-lg bg-primary/5 border-primary/10">
                  <Sparkle
                    weight="duotone"
                    className="w-4 h-4 mt-0.5 text-primary shrink-0"
                  />
                  <p className="text-xs text-muted-foreground">
                    A 6-digit code will be sent to your email. The code expires
                    in 10 minutes.
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {/* ╔═══════════════════════════════╗ */}
          {/* ║  OTP VERIFICATION STEP        ║ */}
          {/* ╚═══════════════════════════════╝ */}
          {step === "otp" && (
            <motion.div
              key="otp-step"
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
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <EnvelopeOpen
                    weight="duotone"
                    className="w-8 h-8 text-primary"
                  />
                </motion.div>
                <h2 className="mb-2 text-xl font-bold font-display text-foreground">
                  Check Your Inbox
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {maskedEmail}
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <Fragment key={index}>
                    {index === 3 && (
                      <span className="text-xl font-bold text-muted-foreground/40">
                        –
                      </span>
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
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={(e) => handleOtpPaste(e, index)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-display
                        border-2 rounded-xl transition-all duration-200
                        bg-card text-foreground
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                        ${digit
                          ? "border-primary/50 bg-primary/5"
                          : "border-border"
                        }
                        ${error ? "border-red-400/50" : ""}
                      `}
                    />
                  </Fragment>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-center text-red-400"
                >
                  {error}
                </motion.p>
              )}

              {/* Resend Timer / Button */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend code in{" "}
                    <span className="font-mono font-medium text-foreground">
                      {String(Math.floor(resendTimer / 60)).padStart(2, "0")}:
                      {String(resendTimer % 60).padStart(2, "0")}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
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
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="flex-1 btn-secondary"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otp.join("").length !== 6}
                  className="flex-1 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {verifyingOtp ? (
                    <span className="flex items-center justify-center gap-2">
                      <CircleNotch className="w-5 h-5 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Verify & Login
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Register link */}
        <div className="mt-10 text-center">
          <div className="h-px mb-8 bg-border" />
          <p className="text-muted-foreground">
            Don't have an account?
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
