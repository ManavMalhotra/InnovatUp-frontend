import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { List, X } from '@phosphor-icons/react';
import AnimatedLogo from './AnimatedLogo';

const navLinks = [
  { label: 'About', href: '#what-is' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Prizes', href: '#prizes' },
  { label: 'FAQs', href: '#faqs' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${isScrolled
          ? 'bg-background/90 backdrop-blur-lg border-b border-border/50 shadow-lg shadow-background/20'
          : 'bg-transparent'
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 relative">
                <AnimatedLogo size={40} animate={false} />
              </div>
              <span className="font-display font-bold text-lg lg:text-xl text-foreground tracking-tight">
                Innovat<span className="text-primary">Up</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {isLandingPage && navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                </button>
              ))}
              <Link
                to="/register"
                className="btn-primary text-sm py-2.5 px-5"
              >
                Register Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] bg-background/98 backdrop-blur-xl lg:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="flex flex-col items-center justify-center h-full gap-8 px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Logo in mobile menu */}
              <div className="mb-8">
                <AnimatedLogo size={80} animate={true} />
              </div>

              {isLandingPage && navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-2xl font-display font-bold text-foreground hover:text-primary transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary text-lg mt-4"
                >
                  Register Now
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
