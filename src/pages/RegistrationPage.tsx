import { useState, useEffect, useRef, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  User,
  EnvelopeSimple,
  Phone,
  Lightbulb,
  Users,
  Buildings,
  FileText,
  Check,
  ShieldCheck,
  ArrowClockwise,
  CircleNotch,
  EnvelopeOpen,
} from "@phosphor-icons/react";
import AnimatedLogo from "../components/AnimatedLogo";
import axios from "axios";

interface TeamMember {
  name: string;
  email: string;
  mobile: string;
}

interface TeamRegistration {
  leaderName: string;
  email: string;
  mobile: string;
  topic: string;
  teamName: string;
  teamSize: number;
  institute: string;
  idea_desc: string;
}

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<TeamRegistration>({
    leaderName: "",
    email: "",
    mobile: "",
    topic: "",
    teamName: "",
    teamSize: 2,
    institute: "",
    idea_desc: "",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", email: "", mobile: "" },
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // ═══════════════════════════════════════
  //  OTP Verification State
  // ═══════════════════════════════════════
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    setOtpError("");
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
  //  Send OTP
  // ═══════════════════════════════════════
  const handleSendOtp = async () => {
    if (!formData.leaderName.trim()) {
      setOtpError("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      setOtpError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setOtpError("Please enter a valid email address");
      return;
    }
    if (!formData.mobile.trim()) {
      setOtpError("Please enter your mobile number");
      return;
    }

    setSendingOtp(true);
    setOtpError("");

    try {
      const baseURL = import.meta.env.VITE_BACKEND_URL;

      const otpFormData = new FormData();
      otpFormData.append("email", formData.email);

      await axios.post(`${baseURL?.replace(/\/$/, "")}/send-otp`, otpFormData);

      setShowOtpStep(true);
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 300);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setOtpError(
          error.response?.data?.detail ||
            "Failed to send OTP. Please try again.",
        );
      } else {
        setOtpError("Something went wrong. Please try again.");
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
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");

    try {
      const baseURL = import.meta.env.VITE_BACKEND_URL;

      const verifyFormData = new FormData();
      verifyFormData.append("email", formData.email);
      verifyFormData.append("otp", otpString);

      const response = await axios.post(
        `${baseURL?.replace(/\/$/, "")}/verify-otp`,
        verifyFormData,
      );

      const result = response.data?.result;

      switch (result) {
        case "otp-verified":
          setEmailVerified(true);
          setShowOtpStep(false);
          setStep(2);
          break;

        case "otp-not-verified":
          setOtpError("Incorrect OTP. Please check and try again.");
          setOtp(["", "", "", "", "", ""]);
          setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
          break;

        case "no-otp-found":
          setOtpError("OTP expired or not found. Please request a new one.");
          setOtp(["", "", "", "", "", ""]);
          setResendTimer(0); // Allow immediate resend
          break;

        case "server-error":
          setOtpError("Server error. Please try again later.");
          break;

        default:
          setOtpError("Unexpected response. Please try again.");
          break;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Backend might also return result in error responses
        const result = error.response?.data?.result;
        const detail = error.response?.data?.detail;

        if (result === "otp-not-verified") {
          setOtpError("Incorrect OTP. Please check and try again.");
        } else if (result === "no-otp-found") {
          setOtpError("OTP expired or not found. Please request a new one.");
          setResendTimer(0);
        } else if (result === "server-error") {
          setOtpError("Server error. Please try again later.");
        } else {
          setOtpError(detail || "Verification failed. Please try again.");
        }

        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } else {
        setOtpError("Something went wrong. Please try again.");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    handleSendOtp();
  };

  // ═══════════════════════════════════════
  //  Team Size Handler
  // ═══════════════════════════════════════
  const handleTeamSizeChange = (size: string) => {
    const newSize = parseInt(size);
    const currentSize = teamMembers.length;

    if (newSize > currentSize + 1) {
      const newMembers = [...teamMembers];
      for (let i = currentSize; i < newSize - 1; i++) {
        newMembers.push({ name: "", email: "", mobile: "" });
      }
      setTeamMembers(newMembers);
    } else if (newSize < currentSize + 1) {
      setTeamMembers(teamMembers.slice(0, newSize - 1));
    }

    setFormData({ ...formData, teamSize: newSize });
  };

  // ═══════════════════════════════════════
  //  Form Submission
  // ═══════════════════════════════════════
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("Please verify your email before submitting.");
      setStep(1);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("leaderName", formData.leaderName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("topic", formData.topic);
    formDataToSend.append("teamName", formData.teamName);
    formDataToSend.append("team_count", teamMembers.length.toString());
    formDataToSend.append("institute", formData.institute);
    formDataToSend.append("idea_desc", formData.idea_desc);

    const cleanTeamMembers = teamMembers.map((member) => ({
      name: member.name,
      email: member.email,
      mobile: member.mobile,
    }));
    formDataToSend.append("team_members", JSON.stringify(cleanTeamMembers));

    try {
      const baseURL = import.meta.env.VITE_BACKEND_URL;
      const endpoint = `${baseURL?.replace(/\/$/, "")}/reg`;
      const response = await axios.post(endpoint, formDataToSend);

      if (response.status === 200 || response.status === 201) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server Error Response:", error.response?.data);
        alert(
          `Registration failed: ${
            error.response?.data?.detail || "Check inputs"
          }`,
        );
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  // ═══════════════════════════════════════
  //  Success Screen
  // ═══════════════════════════════════════
  if (isSubmitted) {
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
          <h2 className="mb-4 headline-lg font-display text-foreground">
            Registration Complete!
          </h2>
          <p className="body-text">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  //  Masked email for OTP screen
  // ═══════════════════════════════════════
  const maskedEmail = (() => {
    const [local, domain] = formData.email.split("@");
    if (!local || !domain) return formData.email;
    const visible = local.slice(0, 2);
    return `${visible}${"•".repeat(Math.max(local.length - 2, 0))}@${domain}`;
  })();

  // ═══════════════════════════════════════
  //  Main Render
  // ═══════════════════════════════════════
  return (
    <div className="min-h-screen px-6 py-4 pb-20 bg-background">
      <div className="max-w-2xl mx-auto">
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
        <div className="mb-10">
          <h1 className="mb-3 headline-lg font-display text-foreground">
            Register for <span className="text-gradient">InnovatUp</span>
          </h1>
          <p className="body-text">
            Fill in your details to secure your spot in the ideathon.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: s * 0.1 }}
            />
          ))}
        </div>

        {/* Progress Labels */}
        <div className="flex justify-between mb-8">
          {["Leader", "Team", "Idea"].map((label, i) => (
            <button
              key={label}
              disabled={i + 1 > step}
              onClick={() => {
                // Prevent going past step 1 if email not verified
                if (i + 1 > 1 && !emailVerified) return;
                setStep(i + 1);
                setShowOtpStep(false);
              }}
              className={`label-mono text-xs transition-colors ${
                i + 1 <= step
                  ? "text-primary cursor-pointer hover:text-primary/80"
                  : "text-muted-foreground cursor-default"
              }`}
            >
              {label}
              {label === "Leader" && emailVerified && (
                <ShieldCheck
                  weight="fill"
                  className="inline-block w-3 h-3 ml-1 text-green-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ╔═══════════════════════════════╗ */}
          {/* ║  STEP 1 — Leader Details      ║ */}
          {/* ╚═══════════════════════════════╝ */}
          {step === 1 && !showOtpStep && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-xl font-bold font-display text-foreground">
                Team Leader Details
              </h2>

              {/* Full Name */}
              <div>
                <label className="block mb-2 label-mono text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.leaderName}
                    onChange={(e) =>
                      setFormData({ ...formData, leaderName: e.target.value })
                    }
                    className="w-full py-4 pl-12 pr-4 transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 label-mono text-muted-foreground">
                  Email ID
                </label>
                <div className="relative">
                  <EnvelopeSimple
                    className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground"
                    weight="duotone"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      // Reset verification if email changes
                      if (emailVerified) {
                        setEmailVerified(false);
                      }
                    }}
                    className={`w-full py-4 pl-12 pr-12 transition-all border bg-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                      emailVerified ? "border-green-500/50" : "border-border"
                    }`}
                    placeholder="you@college.edu"
                  />
                  {emailVerified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -translate-y-1/2 right-4 top-1/2"
                    >
                      <ShieldCheck
                        weight="fill"
                        className="w-5 h-5 text-green-500"
                      />
                    </motion.div>
                  )}
                </div>
                {emailVerified && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-1.5 text-xs text-green-500"
                  >
                    <Check weight="bold" className="w-3 h-3" />
                    Email verified
                  </motion.p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block mb-2 label-mono text-muted-foreground">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full py-4 pl-12 pr-4 transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Error from OTP sending */}
              {otpError && !showOtpStep && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-center text-red-400"
                >
                  {otpError}
                </motion.p>
              )}

              {/* Continue / Verify Button */}
              <button
                type="button"
                onClick={() => {
                  if (emailVerified) {
                    setStep(2);
                  } else {
                    handleSendOtp();
                  }
                }}
                disabled={sendingOtp}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sendingOtp ? (
                  <span className="flex items-center justify-center gap-2">
                    <CircleNotch className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </span>
                ) : emailVerified ? (
                  <span className="flex items-center justify-center gap-2">
                    Continue
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Verify Email & Continue
                  </span>
                )}
              </button>
            </motion.div>
          )}

          {/* ╔═══════════════════════════════╗ */}
          {/* ║  STEP 1.5 — OTP Verification  ║ */}
          {/* ╚═══════════════════════════════╝ */}
          {step === 1 && showOtpStep && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
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
                  Verify Your Email
                </h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit verification code to
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
                        ${
                          digit
                            ? "border-primary/50 bg-primary/5"
                            : "border-border"
                        }
                        ${otpError ? "border-red-400/50" : ""}
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
                    setShowOtpStep(false);
                    setOtp(["", "", "", "", "", ""]);
                    setOtpError("");
                  }}
                  className="flex-1 btn-secondary"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Change Email
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
                      Verify & Continue
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ╔═══════════════════════════════╗ */}
          {/* ║  STEP 2 — Team Information    ║ */}
          {/* ╚═══════════════════════════════╝ */}
          {step === 2 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-xl font-bold font-display text-foreground">
                Team Information
              </h2>

              {/* Team Name */}
              <div>
                <label className="block mb-2 label-mono text-muted-foreground">
                  Team Name
                </label>
                <div className="relative">
                  <Users className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.teamName}
                    onChange={(e) =>
                      setFormData({ ...formData, teamName: e.target.value })
                    }
                    className="w-full py-4 pl-12 pr-4 transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Team Innovators"
                  />
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="block mb-3 label-mono text-muted-foreground">
                  Number of Team Members
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[2, 3, 4, 5].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleTeamSizeChange(size.toString())}
                      className={`
                        py-4 rounded-xl border transition-all duration-200
                        flex flex-col items-center justify-center gap-2
                        ${
                          Number(formData.teamSize) === size
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-card/80"
                        }
                      `}
                    >
                      <Users
                        weight={
                          Number(formData.teamSize) === size
                            ? "duotone"
                            : "regular"
                        }
                        className="w-6 h-6"
                      />
                      <span className="text-lg font-bold font-display">
                        {size} Members
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Members */}
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="p-4 border rounded-xl bg-card/50 border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                    Team Member {index + 2}
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...teamMembers];
                          newMembers[index].name = e.target.value;
                          setTeamMembers(newMembers);
                        }}
                        className="w-full px-4 py-3 transition-all border bg-background border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={member.email}
                        onChange={(e) => {
                          const newMembers = [...teamMembers];
                          newMembers[index].email = e.target.value;
                          setTeamMembers(newMembers);
                        }}
                        className="w-full px-4 py-3 transition-all border bg-background border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={member.mobile}
                        onChange={(e) => {
                          const newMembers = [...teamMembers];
                          newMembers[index].mobile = e.target.value;
                          setTeamMembers(newMembers);
                        }}
                        className="w-full py-4 pl-12 pr-4 transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setShowOtpStep(false);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 btn-primary"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* ╔═══════════════════════════════╗ */}
          {/* ║  STEP 3 — Idea Details        ║ */}
          {/* ╚═══════════════════════════════╝ */}
          {step === 3 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-xl font-bold font-display text-foreground">
                Idea Details
              </h2>

              <div>
                <label className="block mb-2 label-mono text-muted-foreground">
                  Topic/Theme
                </label>
                <div className="relative">
                  <Lightbulb className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    className="w-full py-4 pl-12 pr-4 transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="AI for Healthcare"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 label-mono text-muted-foreground">
                  Institute/College
                </label>
                <div className="relative">
                  <Buildings
                    className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-muted-foreground"
                    weight="duotone"
                  />
                  <input
                    type="text"
                    required
                    value={formData.institute}
                    onChange={(e) =>
                      setFormData({ ...formData, institute: e.target.value })
                    }
                    className="w-full py-4 pl-12 pr-4 transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Your College Name"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 label-mono text-muted-foreground">
                  Brief Description of Idea
                </label>
                <div className="relative">
                  <FileText className="absolute w-5 h-5 left-4 top-4 text-muted-foreground" />
                  <textarea
                    required
                    rows={4}
                    value={formData.idea_desc}
                    onChange={(e) =>
                      setFormData({ ...formData, idea_desc: e.target.value })
                    }
                    className="w-full py-4 pl-12 pr-4 transition-all border resize-none bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Describe your idea in a few sentences..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Complete Registration
                </button>
              </div>
            </motion.div>
          )}
        </form>

        {/* Login link */}
        <p className="mt-8 text-center text-muted-foreground">
          Already registered?
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
