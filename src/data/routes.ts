// Centralized routing and scroll target definitions

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
} as const;

export const SCROLL_TARGETS = {
    HERO: "#hero",
    ABOUT: "#about",
    TIMELINE: "#timeline",
    PRIZES: "#prizes",
    FAQS: "#faqs",
    RULES: "#rules",
} as const;

export const NAV_LINKS = [
    { label: "About", href: SCROLL_TARGETS.ABOUT },
    { label: "Prizes", href: SCROLL_TARGETS.PRIZES },
    { label: "Timeline", href: SCROLL_TARGETS.TIMELINE },
    { label: "FAQs", href: SCROLL_TARGETS.FAQS },
] as const;

/**
 * Utility for smooth scrolling to an element by ID
 * @param href The ID of the element to scroll to (e.g., "#timeline")
 */
export const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
};
