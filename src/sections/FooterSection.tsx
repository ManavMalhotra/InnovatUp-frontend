import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Linkedin, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: 'Timeline', href: '#timeline' },
  { label: 'Rules', href: '#rules' },
  { label: 'Partners', href: '#partners' },
  { label: 'Register', href: '/register' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
];

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={sectionRef}
      className="relative bg-neon-dark py-20 lg:py-32"
    >
      <div className="w-full px-6 lg:px-12">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Contact */}
          <div>
            <h3 className="headline-md font-display text-neon-white mb-6">
              Questions?
            </h3>
            <a
              href="mailto:hello@innovatup.acm.edu"
              className="inline-flex items-center gap-3 text-lg text-neon-gray hover:text-neon-green transition-colors group"
            >
              <Mail className="w-5 h-5" />
              hello@innovatup.acm.edu
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            {/* Social links */}
            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-neon-gray hover:text-neon-green hover:border-neon-green/30 transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right column - Links */}
          <div className="lg:text-right">
            <h4 className="label-mono text-neon-gray mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="text-neon-white hover:text-neon-green transition-colors text-left lg:text-right"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-neon-white hover:text-neon-green transition-colors text-left lg:text-right"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neon-gray">
            Built by students. For students.
          </p>
          <p className="text-sm text-neon-gray">
            © 2026 InnovatUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
