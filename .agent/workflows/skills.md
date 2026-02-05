---
description: InnovatUp website development patterns and preferences
---

# InnovatUp Development Skills

## Project Context
- **Stack**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Animation**: GSAP (ScrollTrigger) + Framer Motion
- **Colors**: Navy blue (#0D1117) base, electric blue (#3B82F6) accent

## Design Principles (User Preferences)
Think as expert creative ui/ux designer with 5+ year of experince in building awaards level website telling stories getting clicks from the website and understand human physcology of the tagert audeince understadining there phycology thinking at there place goals 
1. **NO generic pill/capsule badges** - looks AI-generated
2. **Use typography hierarchy** instead of floating badges
3. **Subtle over flashy** - accent lines, not filled containers
4. **Mobile-first** - test at 375px viewport
5. **Performance-aware** - disable heavy effects on low-end devices

## Component Patterns

### Section Headers
```tsx
// GOOD: Simple label + headline
<span className="label-mono text-primary block mb-2">Section Label</span>
<h2 className="headline-lg text-foreground">
  <span className="text-gradient">Headline</span>
</h2>

// BAD: Pill badges
<span className="px-4 py-2 rounded-full bg-primary/10">Badge Text</span>
```

### Interactive Elements
- Use `glass-card-hover` for card hover effects
- Use `btn-primary` and `btn-secondary` for buttons
- 44px minimum touch target on mobile

### Animations
- GSAP for scroll-triggered animations
- Framer Motion for micro-interactions
- Always check `prefersReducedMotion`

## Files to Know
- `siteConfig.ts` - All static content lives here
- `useDeviceCapability.ts` - Adaptive rendering hook
- `index.css` - CSS variables and utility classes

## Event Details
- **Event**: InnovatUp Ideathon
- **College**: BCIIT (Banarasidas Chandiwala Institute of IT)
- **Date**: Feb 24, 2026
- **Duration**: 48 hours