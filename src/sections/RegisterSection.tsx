import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkle } from '@phosphor-icons/react';
import { siteConfig } from '../data/siteConfig';

export default function RegisterSection() {
  return (
    <section
      id="register"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 mb-8"
        >
          <Sparkle className="w-8 h-8 text-primary" weight="duotone" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="headline-lg font-display text-foreground mb-4"
        >
          {siteConfig.registration.headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="body-text text-lg mb-8 max-w-lg mx-auto"
        >
          {siteConfig.registration.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link
            to="/register"
            className="btn-primary text-lg px-10 py-4 group inline-flex items-center"
          >
            Register Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" weight="bold" />
          </Link>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mt-6"
        >
          {siteConfig.registration.note}
        </motion.p>
      </div>
    </section>
  );
}
