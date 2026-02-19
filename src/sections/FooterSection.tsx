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
    <footer className="relative py-16 overflow-hidden border-t bg-card border-border">
      {/* Subtle horizontal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(transparent 50%, hsl(var(--primary)/0.3) 50%)`,
          backgroundSize: '100% 4px',
        }}
      />

      <div className="relative max-w-6xl px-4 mx-auto sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-3">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <AnimatedLogo size={40} animate={false} />
              <span className="text-xl font-bold font-display text-foreground">
                Innovat<span className="text-primary">Up</span>
              </span>
            </Link>
            <p className="mb-4 text-sm body-text">
              {siteConfig.footer.tagline}
            </p>
            <p className="text-xs text-muted-foreground">
            <Link to="https://bciit.ac.in" className="transition-colors hover:text-primary">
              {siteConfig.collegeName}
            </Link>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 font-bold font-display text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm transition-colors text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 font-bold font-display text-foreground">
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
                    className="flex items-center justify-center w-10 h-10 transition-colors border rounded-xl bg-background border-border text-muted-foreground hover:text-primary hover:border-primary"
                    whileHover={{ y: -2 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" weight="duotone" />
                  </motion.a>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {siteConfig.social.email}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-border sm:flex-row">
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
