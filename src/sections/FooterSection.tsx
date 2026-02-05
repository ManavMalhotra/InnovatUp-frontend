import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { InstagramLogo, LinkedinLogo, EnvelopeSimple } from '@phosphor-icons/react';
import AnimatedLogo from '../components/AnimatedLogo';
import { siteConfig } from '../data/siteConfig';

const socialLinks = [
  { icon: InstagramLogo, href: siteConfig.social.instagram, label: 'Instagram' },
  { icon: LinkedinLogo, href: siteConfig.social.linkedin, label: 'LinkedIn' },
  { icon: EnvelopeSimple, href: `mailto:${siteConfig.social.email}`, label: 'Email' },
];

const footerLinks = [
  { label: 'About', href: '#what-is' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Prizes', href: '#prizes' },
  { label: 'FAQs', href: '#faqs' },
];

export default function FooterSection() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative py-16 bg-card border-t border-border overflow-hidden">
      {/* Subtle horizontal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(transparent 50%, hsl(var(--primary)/0.3) 50%)`,
          backgroundSize: '100% 4px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <AnimatedLogo size={40} animate={false} />
              <span className="font-display font-bold text-xl text-foreground">
                Innovat<span className="text-primary">Up</span>
              </span>
            </Link>
            <p className="body-text text-sm mb-4">
              {siteConfig.footer.tagline}
            </p>
            <p className="text-xs text-muted-foreground">
              {siteConfig.collegeName}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    whileHover={{ y: -2 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" weight="duotone" />
                  </motion.a>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {siteConfig.social.email}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            {siteConfig.footer.copyright}
          </p>
          <p className="text-xs text-muted-foreground">
            Designed by InnovatUp Team
          </p>
        </div>
      </div>
    </footer>
  );
}
