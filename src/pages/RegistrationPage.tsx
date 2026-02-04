import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Phone, Lightbulb, Users, Building2, FileText, Check } from 'lucide-react';

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
    college: '',
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
      <div className="min-h-screen bg-neon-dark flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-neon-green" />
          </div>
          <h2 className="headline-lg font-display text-neon-white mb-4">
            Registration Complete!
          </h2>
          <p className="body-text">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neon-dark py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neon-gray hover:text-neon-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="headline-lg font-display text-neon-white mb-3">
            Register for <span className="text-neon-green">InnovatUp</span>
          </h1>
          <p className="body-text">
            Fill in your details to secure your spot in the ideathon.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-neon-green' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-display font-bold text-neon-white mb-6">
                Team Leader Details
              </h2>
              
              <div>
                <label className="label-mono text-neon-gray block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <input
                    type="text"
                    required
                    value={formData.teamLeaderName}
                    onChange={(e) => setFormData({ ...formData, teamLeaderName: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-neon-gray block mb-2">Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    placeholder="you@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-neon-gray block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-neon-gray block mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-display font-bold text-neon-white mb-6">
                Team Information
              </h2>
              
              <div>
                <label className="label-mono text-neon-gray block mb-2">Team Name</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <input
                    type="text"
                    required
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    placeholder="Team Innovators"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-neon-gray block mb-2">Number of Team Members</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <select
                    required
                    value={formData.teamSize}
                    onChange={(e) => handleTeamSizeChange(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all appearance-none"
                  >
                    <option value="2">2 members</option>
                    <option value="3">3 members</option>
                    <option value="4">4 members</option>
                  </select>
                </div>
              </div>

              {/* Team members */}
              {teamMembers.map((member, index) => (
                <div key={index} className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h4 className="text-sm font-medium text-neon-gray mb-3">
                    Team Member {index + 2}
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...teamMembers];
                        newMembers[index].name = e.target.value;
                        setTeamMembers(newMembers);
                      }}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => {
                        const newMembers = [...teamMembers];
                        newMembers[index].email = e.target.value;
                        setTeamMembers(newMembers);
                      }}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    />
                  </div>
                </div>
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
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-display font-bold text-neon-white mb-6">
                Idea Details
              </h2>
              
              <div>
                <label className="label-mono text-neon-gray block mb-2">Topic/Theme</label>
                <div className="relative">
                  <Lightbulb className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    placeholder="AI for Healthcare"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-neon-gray block mb-2">Institute/College</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-gray" />
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all"
                    placeholder="Your College Name"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-neon-gray block mb-2">Brief Description of Idea</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-neon-gray" />
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-4 text-neon-white placeholder-neon-gray/50 focus:outline-none focus:ring-2 focus:ring-neon-green/50 transition-all resize-none"
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
            </div>
          )}
        </form>

        {/* Login link */}
        <p className="text-center text-neon-gray mt-8">
          Already registered?{' '}
          <Link to="/login" className="text-neon-green hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
