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
    subheadline:
      "48 hours to transform your idea into a working prototype. Mentorship, prizes, and real momentum.",
    ctaPrimary: "Register Now",
    ctaSecondary: "View Timeline",
    eventBadge: "BCIIT Ideathon 2026",
  },

  // ==========================================
  // WHAT IS SECTION
  // ==========================================
  whatIs: {
    headline: "What is InnovatUp?",
    description:
      "A college-wide ideathon where you pick a challenge, form a team, and ship a prototype in 48 hours. Get mentorship, feedback, and a shot at prizes—plus skills that set you apart from the crowd.",
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
        description:
          "Transform your ideas into working prototypes with expert guidance.",
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
      date: "Mar 24",
      title: "Kickoff",
      description: "Challenge reveal + team formation.",
      time: "9:00 AM IST",
      icon: "rocket",
    },
    {
      day: "Day 1",
      date: "Mar 24",
      title: "Build",
      description: "Mentor rounds + checkpoint reviews.",
      time: "All Day",
      icon: "hammer",
    },
    {
      day: "Day 2",
      date: "Mar 24",
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
    totalPrizePool: "₹30,000+",
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
      "Certificates",
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
        description: "2-5 members. No solo entries.",
      },
    //   {
    //     title: "Submit a PPT",
    //     description:
    //       "Send your idea deck before the deadline. Shortlisted teams pitch live.",
    //   },
      {
        title: "Pitch Format",
        description: "3-5 min presentation + 15 min Q&A. Don't go over time.",
      },
      {
        title: "Prototype = Bonus",
        description: "Not required, but a working demo gets you extra points.",
      },
    //   {
    //     title: "Judging Criteria",
    //     description:
    //       "Innovation, real-world impact, technical depth, presentation. Top 3 go to finals.",
    //   },
    //   {
    //     title: "Fair Play",
    //     description:
    //       "No plagiarism, no misconduct. Judges' decisions are final.",
    //   },
    ],
  },

  // ==========================================
  // FAQs
  // ==========================================
  faqs: [
    {
      question: "Do I need a team?",
      answer: "Yes — 2 to 5 members. No solo entries.",
    },
    {
      question: "What do I submit?",
      answer:
        "A PPT with your idea. Shortlisted teams pitch live on event day.",
    },
    {
      question: "Do I need to code?",
      answer:
        "Nope. It's an ideathon — ideas first. A prototype is a bonus, not a requirement.",
    },
    {
      question: "Is it free?",
      answer: "Yes — completely free for all students. Zero fees.",
    },
    {
      question: "How are winners picked?",
      answer:
        "Innovation, impact, technical depth, and presentation. Top 3 go to a final round.",
    },
    {
      question: "I'm a beginner — can I join?",
      answer: "Absolutely. Mentors will help you out. Just bring an idea.",
    },
  ],

  // ==========================================
  // SOCIAL LINKS
  // ==========================================
  social: {
    instagram: "https://www.instagram.com/innovatup_society",
    // linkedin: "https://linkedin.com/company/innovatup",
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
