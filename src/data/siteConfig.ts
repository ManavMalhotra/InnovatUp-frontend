/**
 * InnovatUp Ideathon - Site Configuration
 * ========================================
 * Edit this file to update all static content on the website.
 * All text, dates, and data can be modified here.
 */

export const siteConfig = {
    // ==========================================
    // BASIC INFO
    // ==========================================
    name: "InnovatUp",
    tagline: "Innovate. Build. Launch.",
    description: "A 48-hour ideathon where ideas become reality",
    collegeName: "Banarasidas Chandiwala Institute of Information Technology",
    collegeShort: "BCIIT",

    // ==========================================
    // EVENT DATES
    // ==========================================
    dates: {
        registrationOpens: "2026-02-05T00:00:00+05:30",
        registrationCloses: "2026-03-22T23:59:59+05:30",
        eventStart: "2026-03-24T09:00:00+05:30",
        eventEnd: "2026-03-26T18:00:00+05:30",
        winnersAnnouncement: "2026-02-26T17:00:00+05:30",
    },

    // ==========================================
    // HERO SECTION
    // ==========================================
    hero: {
        headline: ["Innovate.", "Build.", "Launch."],
        subheadline: "48 hours to transform your idea into a working prototype. Mentorship, prizes, and real momentum.",
        ctaPrimary: "Register Now",
        ctaSecondary: "View Timeline",
        eventBadge: "BCIIT Ideathon 2026",
    },

    // ==========================================
    // WHAT IS SECTION
    // ==========================================
    whatIs: {
        headline: "What is InnovatUp?",
        description: "A college-wide ideathon where you pick a challenge, form a team, and ship a prototype in 48 hours. Get mentorship, feedback, and a shot at prizes—plus skills that set you apart from the crowd.",
        stats: {
            duration: "48",
            durationUnit: "hrs",
            durationLabel: "Build + Demo",
        },
    },

    // ==========================================
    // WHY JOIN SECTION
    // ==========================================
    whyJoin: {
        headline: "Why Join?",
        reasons: [
            {
                title: "Build Real Projects",
                description: "Transform your ideas into working prototypes with expert guidance.",
                icon: "code",
            },
            {
                title: "Win Prizes",
                description: "Compete for cash prizes and exclusive opportunities.",
                icon: "trophy",
            },
            {
                title: "Stand Out",
                description: "Gain skills beyond curriculum that differentiate you.",
                icon: "star",
            },
            {
                title: "Network",
                description: "Connect with peers, mentors, and industry professionals.",
                icon: "users",
            },
        ],
    },

    // ==========================================
    // WHO IS THIS FOR SECTION
    // ==========================================
    whoFor: {
        headline: "Who is this for?",
        audiences: [
            {
                title: "BTech Students",
                description: "All years welcome—freshers to final year.",
            },
            {
                title: "BCA & MCA",
                description: "Application developers and CS enthusiasts.",
            },
            {
                title: "BSc Computer Science",
                description: "Theory meets practice—build something real.",
            },
            {
                title: "First-Timers",
                description: "Never built before? Perfect place to start.",
            },
        ],
    },

    // ==========================================
    // TIMELINE
    // ==========================================
    timeline: [
        {
            day: "Day 0",
            date: "Feb 24",
            title: "Kickoff",
            description: "Challenge reveal + team formation.",
            time: "9:00 AM IST",
            icon: "rocket",
        },
        {
            day: "Day 1",
            date: "Feb 25",
            title: "Build",
            description: "Mentor rounds + checkpoint reviews.",
            time: "All Day",
            icon: "hammer",
        },
        {
            day: "Day 2",
            date: "Feb 26",
            title: "Demo",
            description: "Final pitches + winner announcement.",
            time: "3:00 PM IST",
            icon: "presentation",
        },
    ],

    // ==========================================
    // PRIZES
    // ==========================================
    prizes: {
        headline: "Prizes",
        totalPrizePool: "₹10,000+",
        categories: [
            {
                title: "Grand Prize",
                amount: "₹5,000",
                description: "Cash prize + certificates + spotlight feature.",
                icon: "crown",
            },
            {
                title: "Runner-Up",
                amount: "₹3,000",
                description: "Cash prize + certificates.",
                icon: "medal",
            },
            {
                title: "Best Innovation",
                amount: "₹2,000",
                description: "Most creative solution wins.",
                icon: "sparkles",
            },
        ],
        extras: [
            "Certificates for all participants",
            "LinkedIn-worthy portfolio project",
            "Networking opportunities",
        ],
    },

    // ==========================================
    // MENTORS (Skip for now - can be populated later)
    // ==========================================
    mentors: [] as Array<{ name: string; role: string; image: string }>,

    // ==========================================
    // RULES
    // ==========================================
    rules: {
        headline: "Rules & Guidelines",
        items: [
            {
                title: "Team Size",
                description: "2–5 members per team. No solo entries.",
            },
            {
                title: "Submit Your PPT",
                description: "Send your idea deck before the deadline. Only shortlisted teams pitch at the event.",
            },
            {
                title: "Screening",
                description: "Judged on innovation, feasibility, theme relevance, and clarity. Clear the screen → you present.",
            },
            {
                title: "Pitch Format",
                description: "10–15 min presentation + 20 min Q&A with judges. Don't go over time.",
            },
            {
                title: "Prototype = Bonus",
                description: "It's an ideathon, but a working demo gives you extra points.",
            },
            {
                title: "What Judges Look For",
                description: "Innovation, real-world impact, technical depth, and how well you present it.",
            },
            {
                title: "Top 3 Finals",
                description: "Top three teams after evaluation go into a final ranking round.",
            },
            {
                title: "Judges Are Final",
                description: "No appeals. No exceptions. Their call is the call.",
            },
            {
                title: "Keep It Clean",
                description: "No plagiarism, no misconduct. Break the rules = instant DQ.",
            },
        ],
    },

    // ==========================================
    // FAQs
    // ==========================================
    faqs: [
        {
            question: "Do I need a team?",
            answer: "Yes — 2 to 5 members required. No solo entries. Grab your squad and register together.",
        },
        {
            question: "What do I need to submit?",
            answer: "An Idea Presentation (PPT) before the deadline. Shortlisted teams then pitch live at the event.",
        },
        {
            question: "Where does it happen?",
            answer: "College Auditorium. Shortlisted teams present in-person on event day.",
        },
        {
            question: "I'm a total beginner — can I join?",
            answer: "100%. You don't need to code. It's about ideas, not just tech. Mentors will guide you.",
        },
        {
            question: "How are winners picked?",
            answer: "Innovation, feasibility, social impact, technical clarity, and presentation skills. Top 3 go to finals.",
        },
        {
            question: "Do I need a working prototype?",
            answer: "Not required — it's an ideathon. But having one gives you bonus points with the judges.",
        },
        {
            question: "Is it free?",
            answer: "Yep, completely free for all BCIIT students.",
        },
    ],

    // ==========================================
    // SOCIAL LINKS
    // ==========================================
    social: {
        instagram: "https://instagram.com/innovatup",
        linkedin: "https://linkedin.com/company/innovatup",
        email: "innovatup@bciit.ac.in",
    },

    // ==========================================
    // REGISTRATION
    // ==========================================
    registration: {
        headline: "Ready to Innovate?",
        subheadline: "Join 500+ students building the future.",
    },

    // ==========================================
    // FOOTER
    // ==========================================
    footer: {
        tagline: "Built by students. For students.",
        copyright: "© 2026 InnovatUp Society, BCIIT. All rights reserved.",
    },
};

export type SiteConfig = typeof siteConfig;
