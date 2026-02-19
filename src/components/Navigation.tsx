import { useState, useEffect, useCallback, memo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════════════════════════

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: "About", href: "#what-is" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "FAQs", href: "#faqs" },
] as const;

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
    transition: { duration: 0.6, ease: "easeOut" },
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

/**
 * Manages mobile menu state with body scroll lock
 */
const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle body scroll lock and focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Restore focus when closing
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
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
    className={`flex items-center gap-3 group ${className}`}
    aria-label="InnovatUp - Go to homepage"
  >
    {/* FIXED: Changed to w-10 h-10 (40px) to perfectly contain the 40px logo */}
    <div className="flex items-center justify-center w-10 h-10">
      <AnimatedLogo size={40} animate={false} />
    </div>
    <span className="text-lg font-bold tracking-tight font-display lg:text-xl text-foreground">
      Innovat<span className="text-primary">Up</span>
    </span>
  </Link>
));
NavLogo.displayName = "NavLogo";

// ─────────────────────────────────────────────────────────────────

interface NavLinkButtonProps {
  link: NavLink;
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
        className="relative text-sm transition-colors duration-200 text-muted-foreground hover:text-foreground group focus:outline-none focus-visible:text-foreground"
      >
        {link.label}
        <span
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full group-focus-visible:w-full"
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
      <Link to="/login" className="text-sm ">
        Login
      </Link>

      <Link to="/register" className="btn-primary text-sm py-2.5 px-5">
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
            className="fixed inset-0 z-[999] bg-background/98 backdrop-blur-xl lg:hidden"
            onClick={handleOverlayClick}
          >
            <motion.div
              ref={menuRef}
              className="flex flex-col items-center justify-center h-full px-6 pt-16"
              variants={menuContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* REMOVED DUPLICATE CLOSE BUTTON FROM HERE */}

              {/* Logo in mobile menu */}
              <div className="mb-8">
                <AnimatedLogo size={80} animate />
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
                  to="/register"
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

  const scrollToSection = useCallback(
    (href: string) => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      close();
    },
    [close],
  );

  // Memoize nav background classes
  const navClassName = `fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
    isScrolled
      ? "bg-background/90 backdrop-blur-lg border-b border-border/50 shadow-lg shadow-background/20"
      : "bg-transparent"
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
            <NavLogo />
            <DesktopNav
              isLandingPage={isLandingPage}
              onScrollToSection={scrollToSection}
            />
            <MobileMenuButton isOpen={isOpen} onClick={toggle} />
          </div>
        </div>
      </motion.nav>

      <MobileMenuOverlay
        isOpen={isOpen}
        isLandingPage={isLandingPage}
        onClose={close}
        onScrollToSection={scrollToSection}
      />
    </>
  );
}
