import { memo, useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Globe, UsersThree, PresentationChart, ShieldCheck } from "@phosphor-icons/react";

/* ── Animation Variants ── */
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

/* ── Core Event Pillars ── */
const PILLARS = [
    {
        id: "open",
        title: "Open Innovation",
        description: "No limits. No assigned tracks. Present any idea, from any domain, that solves a real-world problem.",
        icon: Globe,
        color: "from-blue-500/20 to-blue-500/0",
        border: "group-hover:border-blue-500/50",
        glow: "bg-blue-500/20",
    },
    {
        id: "mentorship",
        title: "Expert Mentorship",
        description: "We provide the mentors and the space. Sit down with industry veterans and faculty to refine your concept and validate your market.",
        icon: UsersThree,
        color: "from-purple-500/20 to-purple-500/0",
        border: "group-hover:border-purple-500/50",
        glow: "bg-purple-500/20",
    },
    {
        id: "pitch",
        title: "The Pitch Deck",
        description: "This is a pure Ideathon. Distill your solution into a powerful PPT. We aren't judging your code—we are judging your vision.",
        icon: PresentationChart,
        color: "from-emerald-500/20 to-emerald-500/0",
        border: "group-hover:border-emerald-500/50",
        glow: "bg-emerald-500/20",
    },
];

/* ── Pillar Card Component ── */
const PillarCard = memo(function PillarCard({
    pillar,
}: {
    pillar: typeof PILLARS[number];
}) {
    const Icon = pillar.icon;

    return (
        <motion.div
            variants={itemVariants}
            className={`group relative flex flex-col p-8 lg:p-10 rounded-3xl bg-card/60 backdrop-blur-xl border border-white/5 ${pillar.border} transition-all duration-500 hover:bg-card hover:-translate-y-2 shadow-lg hover:shadow-2xl`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

            {/* Icon Ring */}
            <div className="relative flex items-center justify-center w-16 h-16 mb-6 rounded-2xl border border-white/10 bg-background/50 shadow-inner">
                <div className={`absolute inset-0 rounded-2xl ${pillar.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <Icon className="relative z-10 w-8 h-8 text-foreground group-hover:text-white transition-colors duration-300" weight="duotone" />
            </div>

            <h3 className="mb-4 text-2xl font-bold font-display text-white tracking-tight">
                {pillar.title}
            </h3>

            <p className="text-base text-muted-foreground/90 leading-relaxed flex-1">
                {pillar.description}
            </p>

            {/* Decorative dot */}
            <div className="absolute top-8 right-8 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20 group-hover:opacity-0 transition-opacity" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white/20 group-hover:bg-white/50 transition-colors" />
            </div>
        </motion.div>
    );
});

/* ── Main Section ── */
export default function AboutSection() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const headerY = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0]);

    return (
        <section
            id="about"
            ref={containerRef}
            className="relative py-24 lg:py-40 overflow-hidden bg-background"
        >
            {/* Dynamic Master Glows */}
            <motion.div
                style={{ opacity: glowOpacity }}
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.05)_0%,transparent_60%)]"
            />
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-10 max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">

                {/* Header Block */}
                <motion.div
                    className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 lg:mb-28"
                    style={{ y: headerY }}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <ShieldCheck size={18} weight="duotone" className="text-primary" />
                        <span className="text-xs font-bold tracking-widest text-white uppercase">
                            The Experience
                        </span>
                    </div> */}

                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black font-display text-white tracking-tighter leading-[1.1] mb-8">
                        Bring any idea. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground to-white/80">We provide the mentors.</span>
                    </h2>

                    <p className="text-lg lg:text-2xl text-muted-foreground/80 leading-relaxed font-medium max-w-2xl">
                        InnovatUp isn't a traditional coding hackathon. It's a pure Ideathon.
                        Bring your biggest vision, build your pitch deck, and convince the judges.
                    </p>
                </motion.div>

                {/* 3-Pillar Board */}
                <motion.div
                    className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {PILLARS.map((pillar) => (
                        <PillarCard key={pillar.id} pillar={pillar} />
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
