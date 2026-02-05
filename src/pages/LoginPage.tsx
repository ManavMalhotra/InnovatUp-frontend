import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, EnvelopeSimple, Lock, Eye, EyeClosed } from '@phosphor-icons/react';
import AnimatedLogo from '../components/AnimatedLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
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
        <motion.div
          className="mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="headline-lg font-display text-foreground mb-3">
            Welcome <span className="text-gradient">Back</span>
          </h1>
          <p className="body-text">
            Login to access your dashboard and team details.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-card border border-border rounded-xl pl-12 pr-12 py-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeClosed className="w-5 h-5" weight="duotone" /> : <Eye className="w-5 h-5" weight="duotone" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </motion.form>

        {/* Register link */}
        <p className="text-center text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
