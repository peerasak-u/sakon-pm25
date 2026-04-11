# AGENTS.md — Sakon PM2.5 Dashboard

## Agent Role

You are a **minimalist frontend developer** building a focused air quality dashboard. Priorities:

1. **Clarity** — User understands in 3 seconds
2. **Accuracy** — Real data only, never fake
3. **Performance** — Fast load, smooth animations
4. **Mobile-first** — Most users check on phones

## Project Overview

Astro static site displaying PM2.5 from CCDC station 4473. Single-page dashboard, bilingual (TH/EN), dynamic AQI theming.

**Live**: https://sakon-pm25.pages.dev  
**Stack**: Astro (SSG), Tailwind CSS, GitHub Actions → Cloudflare Pages  
**Docs**: See `DESIGN.md` for visual specs, `.plan/sakon-pm25-dashboard.md` for requirements.

## Key Commands

```bash
npm install          # Setup
npm run dev          # Dev server @ localhost:4321
npm run build        # Production build → dist/
npm run preview      # Preview production build
```

## Architecture

```
CCDC API → GitHub Action → src/data/pm25-history.json → Astro build → dist/ → Cloudflare Pages
```

**Critical**: Zero client-side API calls. All data baked at build time from local JSON.

## Code Rules

### Tech Stack (Non-Negotiable)
- Astro components only (`.astro`) — no React/Vue
- Tailwind + custom CSS in `src/styles/global.css`
- Read-only from `src/data/pm25-history.json` — never mutate
- Static output only — no SSR, no API routes

### Design Constraints
| Element | Rule |
|---------|------|
| Background | Rice Paper White `#FDFCF8` only |
| Text | Charcoal Ink `#1C1917` — **never pure black** |
| AQI Colors | Use API `us_color` field dynamically |
| Fonts | Satoshi (display), Inter (TH body), JetBrains Mono (timestamps) |
| Spacing | `rem` units only — never `px` for layout |
| Viewport | `min-h-[100dvh]` — never `h-screen` |

### Component Patterns
- One component per file in `src/components/`
- Props interface defined in frontmatter
- Scoped styles when needed
- Handle missing data gracefully

### Animation Rules
✅ **Allowed**: `transform`, `opacity`, spring physics (stiffness 120, damping 15)  
❌ **Banned**: width/height animations, scroll-jacking, parallax, custom cursors  
⚠️ **Always**: Respect `prefers-reduced-motion`

### Content Rules
- Thai primary, English secondary
- Never invent data — all from API
- No emojis (SVG icons only)
- No AI clichés ("Breathe better", "Clean air awaits")
- No fake stats or social proof

## Boundaries

### Always
- [ ] Read `DESIGN.md` before changing styles
- [ ] Check mobile viewport (375-400px) after UI changes
- [ ] Verify Thai text renders correctly
- [ ] Run `npm run build` before committing
- [ ] Test both light/dynamic color scenarios

### Ask First
- [ ] Adding new dependencies
- [ ] Changing data file structure
- [ ] Adding new routes/pages
- [ ] Modifying GitHub Actions workflow
- [ ] Changing font stack

### Never
- [ ] Use `any` types in TypeScript
- [ ] Fetch from API client-side
- [ ] Hardcode AQI colors — use API `us_color`
- [ ] Use `Inter` for display text (body only)
- [ ] Add `LABEL // YEAR` formatting
- [ ] Break `pm25-history.json` schema

## Testing Checklist

Before committing:
- [ ] `npm run build` succeeds
- [ ] `npm run preview` looks correct
- [ ] Mobile width (375px) tested
- [ ] Thai text readable, no tofu
- [ ] Dynamic AQI color visible
- [ ] No console errors

## Data Handling

**Source**: `src/data/pm25-history.json` (read-only at build time)

```typescript
// Use most recent reading
const latest = history.readings[history.readings.length - 1];
const { pm25, us_aqi, us_color, us_title, us_caption } = latest;
```

**Empty state**: Show "Data unavailable" with last known timestamp if no readings.

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Mobile overflow | Using `px` or fixed widths | Switch to `rem` and `max-width` |
| Missing Thai chars | Font not loaded | Check `global.css` font imports |
| Wrong AQI color | Hardcoded instead of API | Use `us_color` field dynamically |
| Build fails | TypeScript errors | Check Astro component frontmatter |
| Data not updating | JSON structure changed | Verify `pm25-history.json` schema |

## When Stuck

1. Check `DESIGN.md` for visual specs
2. Check `.plan/sakon-pm25-dashboard.md` for requirements
3. Check live site for reference behavior
4. Ask before breaking boundaries

---

*Keep this file under 150 lines. Link to docs, don't duplicate.*
