import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  User,
  EnvelopeSimple,
  Phone,
  Lightbulb,
  Users,
  Buildings,
  FileText,
  Check,
  ShieldCheck,
  CircleNotch,
} from "@phosphor-icons/react";
import AuthNavbar from "../components/AuthNavbar";
import OtpVerification from "../components/OtpVerification";
import { useOtp, maskEmail } from "../hooks/useOtp";
import api from "../lib/api";
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

const PHONE_PLACEHOLDER = "9876543210";
const PHONE_DIGIT_COUNT = 10;

function normalizePhoneNumber(value: string): string {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.startsWith("91") && digitsOnly.length > PHONE_DIGIT_COUNT) {
    return digitsOnly.slice(2, 2 + PHONE_DIGIT_COUNT);
  }

  return digitsOnly.slice(0, PHONE_DIGIT_COUNT);
}

function isValidPhoneNumber(value: string): boolean {
  return normalizePhoneNumber(value).length === PHONE_DIGIT_COUNT;
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
  const [submitError, setSubmitError] = useState("");
  const [stepError, setStepError] = useState("");

  // ═══════════════════════════════════════
  //  OTP Verification State
  // ═══════════════════════════════════════
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Shared OTP hook
  const otpState = useOtp();


  // ═══════════════════════════════════════
  //  Send OTP
  // ═══════════════════════════════════════
  const handleSendOtp = async () => {
    const normalizedLeaderPhone = normalizePhoneNumber(formData.mobile);

    if (!formData.leaderName.trim()) {
      otpState.setOtpError("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      otpState.setOtpError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      otpState.setOtpError("Please enter a valid email address");
      return;
    }
    if (!formData.mobile.trim()) {
      otpState.setOtpError("Please enter your mobile number");
      return;
    }
    if (!isValidPhoneNumber(formData.mobile)) {
      otpState.setOtpError("Please enter a valid 10-digit mobile number");
      return;
    }

    setSendingOtp(true);
    otpState.setOtpError("");

    try {
      const otpFormData = new FormData();
      otpFormData.append("email", formData.email);

      await api.post("/send-otp", otpFormData);

      setShowOtpStep(true);
      otpState.startResendTimer();
      otpState.resetOtp();
      otpState.focusFirstInput(300);
      setFormData((prev) => ({ ...prev, mobile: normalizedLeaderPhone }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        const msg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string }) => d.msg).join(", ")
              : null;
        otpState.setOtpError(
          msg || "Failed to send OTP. Please try again.",
        );
      } else {
        otpState.setOtpError("Something went wrong. Please try again.");
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
      verifyFormData.append("email", formData.email);
      verifyFormData.append("otp", otpState.otpString);

      const response = await api.post("/verify-otp", verifyFormData);

      const result = response.data?.result;

      switch (result) {
        case "otp-verified":
          setEmailVerified(true);
          setShowOtpStep(false);
          setStep(2);
          break;

        case "otp-not-verified":
          otpState.resetOtp();
          otpState.focusFirstInput();
          otpState.setOtpError("Incorrect OTP. Please check and try again.");
          break;

        case "no-otp-found":
          otpState.resetOtp();
          otpState.setOtpError("OTP expired or not found. Please request a new one.");
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
        const status = error.response?.status;
        const detailMsg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string }) => d.msg).join(", ")
              : null;

        // Reset OTP FIRST (resetOtp clears errors internally)
        otpState.resetOtp();
        otpState.focusFirstInput();

        // THEN set the error message (after reset)
        if (result === "otp-not-verified") {
          otpState.setOtpError("Incorrect OTP. Please check and try again.");
        } else if (result === "no-otp-found") {
          otpState.setOtpError("OTP expired or not found. Please request a new one.");
        } else if (result === "server-error") {
          otpState.setOtpError("Server error. Please try again later.");
        } else if (status === 401) {
          otpState.setOtpError(detailMsg || "Invalid or expired OTP. Please try again.");
        } else {
          otpState.setOtpError(detailMsg || "Verification failed. Please try again.");
        }
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

  // ═══════════════════════════════════════
  //  Team Size Handler
  // ═══════════════════════════════════════
  const handleTeamSizeChange = (size: string) => {
    const newSize = parseInt(size);
    const currentSize = teamMembers.length;
    setStepError("");

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

  const validateStepTwo = () => {
    if (!formData.teamName.trim()) {
      setStepError("Please enter your team name.");
      return false;
    }

    for (let index = 0; index < teamMembers.length; index += 1) {
      const member = teamMembers[index];
      const memberNumber = index + 2;

      if (!member.name.trim()) {
        setStepError(`Please enter Team Member ${memberNumber}'s full name.`);
        return false;
      }

      if (!member.email.trim()) {
        setStepError(`Please enter Team Member ${memberNumber}'s email address.`);
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        setStepError(`Please enter a valid email for Team Member ${memberNumber}.`);
        return false;
      }

      if (!member.mobile.trim()) {
        setStepError(`Please enter Team Member ${memberNumber}'s mobile number.`);
        return false;
      }

      if (!isValidPhoneNumber(member.mobile)) {
        setStepError(`Please enter a valid 10-digit mobile number for Team Member ${memberNumber}.`);
        return false;
      }
    }

    setStepError("");
    return true;
  };

  // ═══════════════════════════════════════
  //  Form Submission
  // ═══════════════════════════════════════
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailVerified) {
      setSubmitError("Please verify your email before submitting.");
      setStep(1);
      return;
    }

    setSubmitError("");
    setStepError("");

    if (!validateStepTwo()) {
      setStep(2);
      return;
    }

    if (!isValidPhoneNumber(formData.mobile)) {
      setSubmitError("Please enter a valid 10-digit mobile number for the team leader.");
      setStep(1);
      return;
    }

    const normalizedLeaderPhone = normalizePhoneNumber(formData.mobile);
    const cleanTeamMembers = teamMembers.map((member) => ({
      name: member.name.trim(),
      email: member.email.trim(),
      mobile: normalizePhoneNumber(member.mobile),
    }));

    const formDataToSend = new FormData();
    formDataToSend.append("leaderName", formData.leaderName.trim());
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("mobile", normalizedLeaderPhone);
    formDataToSend.append("topic", formData.topic.trim());
    formDataToSend.append("teamName", formData.teamName.trim());
    formDataToSend.append("team_count", teamMembers.length.toString());
    formDataToSend.append("institute", formData.institute.trim());
    formDataToSend.append("idea_desc", formData.idea_desc.trim());
    formDataToSend.append("team_members", JSON.stringify(cleanTeamMembers));

    try {
      const response = await api.post("/reg", formDataToSend);

      if (response.status === 200 || response.status === 201) {
        setFormData((prev) => ({ ...prev, mobile: normalizedLeaderPhone }));
        setTeamMembers(cleanTeamMembers);
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const result = error.response?.data?.result;
        const detail = error.response?.data?.detail;
        const msg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string }) => d.msg).join(", ")
              : null;

        if (result === "already-registered") {
          setSubmitError("This email is already registered. Please login instead.");
        } else {
          setSubmitError(
            `Registration failed: ${msg || result || "Please check your inputs and try again."}`,
          );
        }
      } else {
        setSubmitError("Something went wrong. Please try again.");
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
          <h2 className="mb-4 text-2xl font-bold font-display text-foreground">
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
  const maskedEmail = maskEmail(formData.email);

  // ═══════════════════════════════════════
  //  Main Render
  // ═══════════════════════════════════════
  return (
    <div className="min-h-screen px-4 pt-16 pb-8 sm:px-6 bg-background">
      <AuthNavbar />
      <div className="max-w-2xl mx-auto">

        {/* Glass Card */}
        <div className="p-4 border bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl sm:p-6">
          {/* Header */}
          <div className="mb-3">
            <h1 className="mb-1 text-xl font-bold sm:text-2xl font-display text-foreground">
              Register for <span className="text-gradient">INNOVATUP</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Fill in your details to secure your spot in the ideathon.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-5">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"
                  }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: s * 0.1 }}
              />
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ╔═══════════════════════════════╗ */}
            {/* ║  STEP 1 — Leader Details      ║ */}
            {/* ╚═══════════════════════════════╝ */}
            {step === 1 && !showOtpStep && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-3 text-lg font-bold font-display text-foreground">
                  Team Leader Details
                </h2>

                <div>
                  <label className="block mb-1.5 text-xs label-mono text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={formData.leaderName}
                      onChange={(e) =>
                        setFormData({ ...formData, leaderName: e.target.value })
                      }
                      className="w-full py-3 pl-10 pr-4 text-sm transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs label-mono text-muted-foreground">
                    Email ID
                  </label>
                  <div className="relative">
                    <EnvelopeSimple
                      className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
                      weight="duotone"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (emailVerified) {
                          setEmailVerified(false);
                        }
                      }}
                      className={`w-full py-3 pl-10 pr-12 text-sm transition-all border bg-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${emailVerified ? "border-green-500/50" : "border-border"
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

                <div>
                  <label className="block mb-1.5 text-xs label-mono text-muted-foreground">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          mobile: normalizePhoneNumber(e.target.value),
                        });
                        otpState.setOtpError("");
                      }}
                      className="w-full py-3 pl-10 pr-4 text-sm transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder={PHONE_PLACEHOLDER}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Country code is optional. We&apos;ll save only the 10-digit mobile number.
                  </p>
                </div>

                {/* Error from OTP sending */}
                {otpState.otpError && !showOtpStep && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-sm text-center text-red-400 border rounded-lg bg-red-500/5 border-red-500/20"
                  >
                    {otpState.otpError}
                  </motion.div>
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
              <OtpVerification
                otpState={otpState}
                maskedEmail={maskedEmail}
                verifying={verifyingOtp}
                sendingOtp={sendingOtp}
                onVerify={handleVerifyOtp}
                onBack={() => {
                  setShowOtpStep(false);
                  otpState.resetOtp();
                }}
                onResend={handleResendOtp}
                backLabel="Change Email"
                verifyLabel="Verify & Continue"
                title="Verify Your Email"
                subtitle="We've sent a 6-digit verification code to"
              />
            )}

            {/* ╔═══════════════════════════════╗ */}
            {/* ║  STEP 2 — Team Information    ║ */}
            {/* ╚═══════════════════════════════╝ */}
            {step === 2 && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-3 text-lg font-bold font-display text-foreground">
                  Team Information
                </h2>

                <div>
                  <label className="block mb-1.5 text-xs label-mono text-muted-foreground">
                    Team Name
                  </label>
                  <div className="relative">
                    <Users className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={formData.teamName}
                      onChange={(e) => {
                        setFormData({ ...formData, teamName: e.target.value });
                        setStepError("");
                      }}
                      className="w-full py-3 pl-10 pr-4 text-sm transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="Team Innovators"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs label-mono text-muted-foreground">
                    Number of Team Members
                  </label>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {[2, 3, 4, 5].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleTeamSizeChange(size.toString())}
                        className={`
                        py-3 rounded-xl border transition-all duration-200
                        flex flex-col items-center justify-center gap-1
                        ${Number(formData.teamSize) === size
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-card/80"
                          }
                      `}
                      >
                        <span className="text-sm font-bold font-display">
                          {size}
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
                            setStepError("");
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
                            setStepError("");
                          }}
                          className="w-full px-4 py-3 transition-all border bg-background border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                        <input
                          type="tel"
                          required
                          value={member.mobile}
                          onChange={(e) => {
                            const newMembers = [...teamMembers];
                            newMembers[index].mobile = normalizePhoneNumber(
                              e.target.value,
                            );
                            setTeamMembers(newMembers);
                            setStepError("");
                          }}
                          className="w-full py-3 pl-10 pr-4 text-sm transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          placeholder={PHONE_PLACEHOLDER}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {stepError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-sm text-center text-red-400 border rounded-lg bg-red-500/5 border-red-500/20"
                  >
                    {stepError}
                  </motion.div>
                )}

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
                    onClick={() => {
                      if (!validateStepTwo()) return;
                      setStep(3);
                    }}
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
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-3 text-lg font-bold font-display text-foreground">
                  Idea Details
                </h2>

                <div>
                  <label className="block mb-1.5 text-xs label-mono text-muted-foreground">
                    Topic/Theme
                  </label>
                  <div className="relative">
                    <Lightbulb className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      className="w-full py-3 pl-10 pr-4 text-sm transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="AI for Healthcare"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs label-mono text-muted-foreground">
                    Institute/College
                  </label>
                  <div className="relative">
                    <Buildings
                      className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
                      weight="duotone"
                    />
                    <input
                      type="text"
                      required
                      value={formData.institute}
                      onChange={(e) =>
                        setFormData({ ...formData, institute: e.target.value })
                      }
                      className="w-full py-3 pl-10 pr-4 text-sm transition-all border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="Your College Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs label-mono text-muted-foreground">
                    Brief Description of Idea
                  </label>
                  <div className="relative">
                    <FileText className="absolute w-4 h-4 left-3 top-3.5 text-muted-foreground" />
                    <textarea
                      required
                      rows={3}
                      value={formData.idea_desc}
                      onChange={(e) =>
                        setFormData({ ...formData, idea_desc: e.target.value })
                      }
                      className="w-full py-3 pl-10 pr-4 text-sm transition-all border resize-none bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="Describe your idea in a few sentences..."
                    />
                  </div>
                </div>

                {/* Submit Error */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-sm text-center text-red-400 border rounded-lg bg-red-500/5 border-red-500/20"
                  >
                    {submitError}
                  </motion.div>
                )}

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
        </div>

        {/* Login link */}
        <p className="mt-4 text-sm text-center text-muted-foreground">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
