import { useState, useEffect, useCallback, memo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";
import bciit from "../../public/bciit.svg";

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════════════════════════

import { NAV_LINKS, ROUTES } from "../data/routes";

const SCROLL_THRESHOLD = 100;
// const SCROLL_THROTTLE_MS = 16; // ~60fps

// ═══════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS - Defined outside to prevent recreation
// ═══════════════════════════════════════════════════════════════════

const navVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    // Added 'as const' to prevent TypeScript from widening "easeOut" to a generic string
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuContentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1 },
  },
  exit: { opacity: 0, y: 20 },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + index * 0.05 },
  }),
};

// ═══════════════════════════════════════════════════════════════════
// CUSTOM HOOKS
// ═══════════════════════════════════════════════════════════════════

/**
 * Tracks scroll position with throttling for performance
 */
const useScrolled = (threshold = SCROLL_THRESHOLD): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > threshold);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // Check initial scroll position
    setIsScrolled(window.scrollY > threshold);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
};

import { useLockBodyScroll } from "react-use";

/**
 * Manages mobile menu state with body scroll lock
 */
const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Lock body scroll when the menu is open
  useLockBodyScroll(isOpen);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Manage focus restoration
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else {
      // Restore focus when closing
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, close };
};

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

interface NavLogoProps {
  className?: string;
}

const NavLogo = memo<NavLogoProps>(({ className = "" }) => (
  <Link
    to="/"
    className={`flex items-center gap-1.5 sm:gap-2 group ${className}`}
    aria-label="InnovatUp - Go to homepage"
  >
    <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
      <div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-0 bg-primary/30 blur-md group-hover:opacity-100" />
      <div className="scale-[0.8] sm:scale-100 flex items-center justify-center">
        <AnimatedLogo size={40} animate={false} />
      </div>
    </div>
    <span className="text-[15px] sm:text-xl font-bold tracking-tight font-display text-foreground">
      INNOVAT<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">UP</span>
    </span>
  </Link>
));
NavLogo.displayName = "NavLogo";

// ─────────────────────────────────────────────────────────────────

interface NavLinkButtonProps {
  link: { label: string; href: string };
  onClick: (href: string) => void;
  variant?: "desktop" | "mobile";
  index?: number;
}

const NavLinkButton = memo<NavLinkButtonProps>(
  ({ link, onClick, variant = "desktop", index = 0 }) => {
    const handleClick = useCallback(() => {
      onClick(link.href);
    }, [onClick, link.href]);

    if (variant === "mobile") {
      return (
        <motion.button
          onClick={handleClick}
          className="px-4 py-2 text-2xl font-bold transition-colors rounded-lg font-display text-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          variants={menuItemVariants}
          custom={index}
          initial="hidden"
          animate="visible"
        >
          {link.label}
        </motion.button>
      );
    }

    return (
      <button
        onClick={handleClick}
        className="relative px-3 py-2 text-sm font-medium transition-colors duration-300 text-muted-foreground hover:text-white group focus:outline-none"
      >
        <span className="relative z-10">{link.label}</span>
        <div className="absolute inset-0 z-0 transition-opacity duration-300 rounded-lg opacity-0 bg-primary/10 group-hover:opacity-100 blur-sm" />
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-[80%]"
          aria-hidden="true"
        />
      </button>
    );
  },
);
NavLinkButton.displayName = "NavLinkButton";

// ─────────────────────────────────────────────────────────────────

interface DesktopNavProps {
  isLandingPage: boolean;
  onScrollToSection: (href: string) => void;
}

const DesktopNav = memo<DesktopNavProps>(
  ({ isLandingPage, onScrollToSection }) => (
    <div className="items-center hidden gap-8 lg:flex">
      {isLandingPage &&
        NAV_LINKS.map((link) => (
          <NavLinkButton
            key={link.label}
            link={link}
            onClick={onScrollToSection}
          />
        ))}
      <Link to={ROUTES.LOGIN} className="text-sm ">
        Login
      </Link>

      <Link to={ROUTES.REGISTER} className="btn-primary text-sm py-2.5 px-5">
        Register Now
      </Link>
    </div>
  ),
);
DesktopNav.displayName = "DesktopNav";

// ─────────────────────────────────────────────────────────────────

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = memo<MobileMenuButtonProps>(({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 transition-colors rounded-lg lg:hidden text-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
  >
    {isOpen ? (
      <X size={24} weight="bold" aria-hidden="true" />
    ) : (
      <List size={24} weight="bold" aria-hidden="true" />
    )}
  </button>
));
MobileMenuButton.displayName = "MobileMenuButton";

// ─────────────────────────────────────────────────────────────────

interface MobileMenuOverlayProps {
  isOpen: boolean;
  isLandingPage: boolean;
  onClose: () => void;
  onScrollToSection: (href: string) => void;
}

const MobileMenuOverlay = memo<MobileMenuOverlayProps>(
  ({ isOpen, isLandingPage, onClose, onScrollToSection }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Focus first focusable element when menu opens
    useEffect(() => {
      if (isOpen && menuRef.current) {
        const firstFocusable = menuRef.current.querySelector<HTMLElement>(
          'button, a, [tabindex]:not([tabindex="-1"])',
        );
        firstFocusable?.focus();
      }
    }, [isOpen]);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        // Only close if clicking the overlay itself, not its children
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose],
    );

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] bg-[#080B10]/95 backdrop-blur-2xl lg:hidden overflow-hidden"
            onClick={handleOverlayClick}
          >
            {/* Ambient Mobile Glows */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

            <motion.div
              ref={menuRef}
              className="flex flex-col items-center justify-center h-full px-6 pt-16"
              variants={menuContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Logo in mobile menu */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <AnimatedLogo size={60} animate />
                  <span className="text-3xl font-bold tracking-tight font-display text-foreground">
                    INNOVAT<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">UP</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={bciit}
                    alt="BCIIT Logo"
                    className="object-contain bg-white rounded-full w-14 h-14"
                  />
                  <span className="text-3xl font-bold tracking-tight font-display text-foreground">
                    BCIIT
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col items-center gap-6">
                  {isLandingPage &&
                    NAV_LINKS.map((link, index) => (
                      <li key={link.label}>
                        <NavLinkButton
                          link={link}
                          onClick={onScrollToSection}
                          variant="mobile"
                          index={index}
                        />
                      </li>
                    ))}
                </ul>
              </nav>

              {/* Register CTA */}
              <motion.div
                variants={menuItemVariants}
                custom={NAV_LINKS.length}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={ROUTES.REGISTER}
                  onClick={onClose}
                  className="mt-4 text-lg btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  Register Now
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);
MobileMenuOverlay.displayName = "MobileMenuOverlay";

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function Navigation() {
  const location = useLocation();
  const isScrolled = useScrolled();
  const { isOpen, toggle, close } = useMobileMenu();

  const isLandingPage = location.pathname === "/";

  const scrollToSectionLocal = useCallback(
    (href: string) => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      close();
    },
    [close],
  );

  const navClassName = `fixed top-0 left-0 right-0 w-full z-[1000] safe-padding-x transition-all duration-500 ${isScrolled
    ? "bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(59,130,246,0.05)] py-0"
    : "bg-transparent py-1 lg:py-2"
    }`;

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={navClassName}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center">
              <NavLogo />
              <div className="flex items-center gap-1.5 sm:gap-3 ml-1.5 sm:ml-3">
                <span className="mr-1 text-base font-medium sm:text-xl text-white/30 sm:mr-2">
                  |
                </span>
                <img
                  src={bciit}
                  alt="BCIIT Logo"
                  className="object-contain bg-white rounded-full w-7 h-7 sm:w-10 sm:h-10"
                />
                <span className="text-[15px] sm:text-xl font-bold tracking-tight font-display text-foreground">
                  BCIIT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DesktopNav
                isLandingPage={isLandingPage}
                onScrollToSection={scrollToSectionLocal}
              />
              <MobileMenuButton isOpen={isOpen} onClick={toggle} />
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenuOverlay
        isOpen={isOpen}
        isLandingPage={isLandingPage}
        onClose={close}
        onScrollToSection={scrollToSectionLocal}
      />
    </>
  );
}
