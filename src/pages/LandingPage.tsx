import { useState } from 'react';
import { motion, useAnimation, type Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, Users, Rocket, Code, Sparkles } from 'lucide-react';

// Particle explosion component
function ParticleExplosion({ onComplete }: { onComplete: () => void }) {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    angle: (i / 30) * 360,
    distance: 100 + Math.random() * 150,
    size: 4 + Math.random() * 8,
    color: ['#818cf8', '#2dd4bf', '#a78bfa', '#34d399'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
            y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          onAnimationComplete={particle.id === 0 ? onComplete : undefined}
        />
      ))}
    </div>
  );
}

// Sponsor logos (placeholders)
const sponsors = [
  'Google', 'Microsoft', 'AWS', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Stripe'
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showExplosion, setShowExplosion] = useState(false);
  const controls = useAnimation();

  const handleRegisterClick = async () => {
    setShowExplosion(true);
    await controls.start({
      scale: [1, 0.95, 1.05, 0],
      opacity: [1, 1, 0.5, 0],
      transition: { duration: 0.5 },
    });
  };

  const handleExplosionComplete = () => {
    navigate('/register');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-space-grotesk font-bold text-2xl tracking-tighter"
          >
            Innovat<span className="text-indigo-400">Up</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <a href="#about" className="text-white/60 hover:text-white transition-colors text-sm">
              About
            </a>
            <a href="#prize" className="text-white/60 hover:text-white transition-colors text-sm">
              Prize
            </a>
            <button
              onClick={() => navigate('/login')}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Login
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-400 text-sm tracking-[0.3em] uppercase mb-6"
          >
            College Ideathon 2026
          </motion.p>

          <h1 className="font-space-grotesk font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9] mb-8">
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block"
            >
              Ship ideas.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="block gradient-text"
            >
              Break barriers.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-12"
          >
            48 hours. Build prototypes. Win prizes. Launch your future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="relative inline-block"
          >
            <motion.button
              onClick={handleRegisterClick}
              animate={controls}
              className="cyber-btn text-lg"
            >
              <span className="flex items-center gap-3">
                <Rocket className="w-5 h-5" />
                Initialize Registration
              </span>
            </motion.button>
            {showExplosion && <ParticleExplosion onComplete={handleExplosionComplete} />}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Section */}
      <section id="about" className="py-24 px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="font-space-grotesk font-bold text-4xl md:text-5xl tracking-tighter mb-12 text-center"
          >
            The <span className="gradient-text">Experience</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
            {/* Card 1 - About (Span 2 cols) */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 md:row-span-2 glass-card-hover p-8 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-space-grotesk font-bold text-3xl md:text-4xl mb-4">
                  About InnovatUp
                </h3>
                <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                  A 48-hour ideathon where teams transform concepts into working prototypes.
                  Get mentorship from industry leaders, compete for prizes, and build something
                  that matters.
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Code className="w-4 h-4" />
                  <span>Code</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Zap className="w-4 h-4" />
                  <span>Design</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Rocket className="w-4 h-4" />
                  <span>Launch</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Prize */}
            <motion.div
              id="prize"
              variants={itemVariants}
              className="glass-card-hover p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="font-space-grotesk font-bold text-2xl mb-2">The Prize</h3>
              <p className="text-white/50 text-sm">
                ₹1,00,000 + Internships + Cloud Credits
              </p>
            </motion.div>

            {/* Card 3 - Sponsors (Tall with marquee) */}
            <motion.div
              variants={itemVariants}
              className="md:row-span-2 glass-card-hover p-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5 text-teal-400" />
                <h3 className="font-space-grotesk font-bold text-xl">Sponsors</h3>
              </div>

              <div className="marquee h-[280px]">
                <div className="marquee-content flex flex-col gap-4">
                  {[...sponsors, ...sponsors].map((sponsor, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 bg-white/5 rounded-lg text-center text-white/60 text-sm font-medium"
                    >
                      {sponsor}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 4 - Stats */}
            <motion.div
              variants={itemVariants}
              className="glass-card-hover p-6 flex flex-col justify-center"
            >
              <div className="text-4xl font-space-grotesk font-bold gradient-text mb-1">48h</div>
              <p className="text-white/50 text-sm">Of intense building</p>
            </motion.div>

            {/* Card 5 - Teams */}
            <motion.div
              variants={itemVariants}
              className="glass-card-hover p-6 flex flex-col justify-center"
            >
              <div className="text-4xl font-space-grotesk font-bold gradient-text mb-1">200+</div>
              <p className="text-white/50 text-sm">Teams competing</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-space-grotesk font-bold text-xl">
            Innovat<span className="text-indigo-400">Up</span>
          </div>
          <p className="text-white/40 text-sm">
            Built by students. For students. © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
