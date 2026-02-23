import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react";
import AnimatedLogo from "../components/AnimatedLogo";
import { siteConfig } from "../data/siteConfig";

const socialLinks = [
  {
    icon: InstagramLogo,
    href: siteConfig.social.instagram,
    label: "Instagram",
  },
  {
    icon: EnvelopeSimple,
    href: `mailto:${siteConfig.social.email}`,
    label: "Email",
  },
];

const footerLinks = [
  { label: "About", href: "#what-is" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "FAQs", href: "#faqs" },
];

export default function FooterSection() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative py-20 overflow-hidden bg-background border-t border-white/5">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radical Glows */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[120px]" />

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Massive BCIIT Watermark */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] flex justify-center opacity-[0.02] select-none z-0">
          <span className="text-[20vw] font-black leading-none font-display tracking-tight text-white whitespace-nowrap">
            BCIIT
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl px-4 mx-auto sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 mb-16 md:grid-cols-12">

          {/* Brand & Authority (Takes up 5 cols out of 12) */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <AnimatedLogo size={48} animate={false} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-display tracking-tight text-foreground">
                  Innovat<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Up</span>
                </span>
                <span className="text-xs font-mono font-medium tracking-[0.2em] text-muted-foreground uppercase mt-1">
                  Ideathon 2026
                </span>
              </div>
            </Link>

            <p className="mb-8 text-base text-muted-foreground/80 leading-relaxed max-w-sm">
              {siteConfig.footer.tagline} {siteConfig.description}
            </p>

            {/* BCIIT Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <img
                src="https://res.cloudinary.com/drzuf8zin/image/upload/v1771581178/bciit_vqjhht.png"
                alt="BCIIT Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-muted-foreground uppercase leading-none mb-1">
                  Powered By
                </span>
                <Link to="https://bciit.ac.in" target="_blank" className="text-sm font-semibold text-foreground hover:text-primary transition-colors leading-none">
                  {siteConfig.collegeShort} New Delhi
                </Link>
              </div>
            </div>
          </div>

          {/* Quick links (Takes 3 cols out of 12) */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="mb-6 text-lg font-bold font-display text-white tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-all hover:text-white"
                  >
                    <span className="w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Contact (Takes 3 cols out of 12) */}
          <div className="md:col-span-3">
            <h4 className="mb-6 text-lg font-bold font-display text-white tracking-wide">
              Comms Link
            </h4>

            {/* Social Icons */}
            <div className="flex gap-4 mb-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-muted-foreground transition-all duration-300 hover:text-white hover:border-primary/50 group"
                    whileHover={{ y: -4 }}
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icon className="relative z-10 w-6 h-6" weight="duotone" />
                  </motion.a>
                );
              })}
            </div>

            {/* Support Contacts */}
            <div className="space-y-4">
              <a href={`mailto:${siteConfig.social.email}`} className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <EnvelopeSimple weight="duotone" className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">
                  {siteConfig.social.email}
                </span>
              </a>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Alok Mishra</span>
                  <span className="text-xs text-muted-foreground">Faculty Coordinator • +91 XXXXXXXXXX</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Manav / Saksham</span>
                  <span className="text-xs text-muted-foreground">Technical Team • +91 XXXXXXXXXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-white/10 sm:flex-row">
          <p className="text-sm font-mono text-muted-foreground/60">
            {siteConfig.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-muted-foreground/60">
              Initiated by{" "}
              <span className="text-white">InnovatUp Society</span>
            </span>
            {/* Decorative element */}
            <div className="flex gap-1 opacity-50">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <div className="w-1 h-1 rounded-full bg-primary/60" />
              <div className="w-1 h-1 rounded-full bg-primary/30" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
