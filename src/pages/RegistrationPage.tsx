import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, User, EnvelopeSimple, Lock, Phone, Lightbulb, Users, Buildings, FileText, Check } from '@phosphor-icons/react';
import AnimatedLogo from '../components/AnimatedLogo';
import { siteConfig } from '../data/siteConfig';

interface TeamMember {
  name: string;
  email: string;
}

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamLeaderName: '',
    email: '',
    password: '',
    mobile: '',
    topic: '',
    teamName: '',
    teamSize: '2',
    college: siteConfig.collegeName,
    description: '',
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: '', email: '' },
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTeamSizeChange = (size: string) => {
    const newSize = parseInt(size);
    const currentSize = teamMembers.length;

    if (newSize > currentSize) {
      const newMembers = [...teamMembers];
      for (let i = currentSize; i < newSize - 1; i++) {
        newMembers.push({ name: '', email: '' });
      }
      setTeamMembers(newMembers);
    } else if (newSize < currentSize + 1) {
      setTeamMembers(teamMembers.slice(0, newSize - 1));
    }

    setFormData({ ...formData, teamSize: size });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="headline-lg font-display text-foreground mb-4">
            Registration Complete!
          </h2>
          <p className="body-text">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-6">
          <AnimatedLogo size={40} animate={false} />
          <span className="font-display font-bold text-xl text-foreground">
            Innovat<span className="text-primary">Up</span>
          </span>
        </Link>

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="headline-lg font-display text-foreground mb-3">
            Register for <span className="text-gradient">InnovatUp</span>
          </h1>
          <p className="body-text">
            Fill in your details to secure your spot in the ideathon.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-border'
                }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: s * 0.1 }}
            />
          ))}
        </div>

        {/* Progress labels */}
        <div className="flex justify-between mb-8">
          {['Leader', 'Team', 'Idea'].map((label, i) => (
            <button
              key={label}
              disabled={i + 1 > step}
              onClick={() => setStep(i + 1)}
              className={`label-mono text-xs transition-colors ${i + 1 <= step ? 'text-primary cursor-pointer hover:text-primary/80' : 'text-muted-foreground cursor-default'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-display font-bold text-foreground mb-6">
                Team Leader Details
              </h2>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.teamLeaderName}
                    onChange={(e) => setFormData({ ...formData, teamLeaderName: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Email ID</label>
                <div className="relative">
                  <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="you@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-display font-bold text-foreground mb-6">
                Team Information
              </h2>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Team Name</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Team Innovators"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-muted-foreground block mb-3">Number of Team Members</label>
                <div className="grid grid-cols-3 gap-4">
                  {[2, 3, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleTeamSizeChange(size.toString())}
                      className={`
                        py-4 rounded-xl border transition-all duration-200
                        flex flex-col items-center justify-center gap-2
                        ${Number(formData.teamSize) === size
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                          : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-card/80'
                        }
                      `}
                    >
                      <Users weight={Number(formData.teamSize) === size ? "duotone" : "regular"} className="w-6 h-6" />
                      <span className="font-display font-bold text-lg">{size} Members</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team members */}
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-xl bg-card/50 border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Team Member {index + 2}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-display font-bold text-foreground mb-6">
                Idea Details
              </h2>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Topic/Theme</label>
                <div className="relative">
                  <Lightbulb className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="AI for Healthcare"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Institute/College</label>
                <div className="relative">
                  <Buildings className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Your College Name"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-muted-foreground block mb-2">Brief Description of Idea</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    placeholder="Describe your idea in a few sentences..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Complete Registration
                </button>
              </div>
            </motion.div>
          )}
        </form>

        {/* Login link */}
        <p className="text-center text-muted-foreground mt-8">
          Already registered?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
