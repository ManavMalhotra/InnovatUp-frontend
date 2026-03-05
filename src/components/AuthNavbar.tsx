import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { motion } from "motion/react";
import AnimatedLogo from "./AnimatedLogo";

/**
 * Shared navigation bar for auth pages (Login, Register).
 * Provides a back-to-home button + branding, matching the main site's navbar style.
 */
const AuthNavbar = memo(function AuthNavbar() {
    const navigate = useNavigate();

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5"
        >
            <div className="w-full px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-1.5 -ml-3 text-sm font-medium transition-colors rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 group"
                        aria-label="Go back"
                    >
                        <ArrowLeft
                            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                            weight="bold"
                        />
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    {/* Center logo / branding */}
                    <Link
                        to="/"
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
                        aria-label="Go to homepage"
                    >
                        <div className="flex items-center justify-center w-8 h-8">
                            <AnimatedLogo size={32} animate={false} />
                        </div>
                        <span className="text-base sm:text-lg font-bold tracking-tight font-display text-foreground">
                            INNOVAT
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                UP
                            </span>
                        </span>
                    </Link>

                    {/* Spacer to balance the layout */}
                    <div className="w-16" />
                </div>
            </div>
        </motion.nav>
    );
});

export default AuthNavbar;
