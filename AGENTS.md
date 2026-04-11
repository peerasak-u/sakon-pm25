# Agent Rules: Sakon PM2.5 Dashboard

This document defines the rules and constraints for AI agents working on this project. All agents must follow these guidelines to maintain design integrity and code quality.

---

## 1. Project Context

**What this is**: A minimal, single-focus PM2.5 air quality dashboard for Srisanakarin Park, Sakon Nakhon. Built with Astro, deployed to Cloudflare Pages, data from CCDC API.

**Core principle**: Help users decide in under 3 seconds if it's safe to go outside.

**Live URL**: https://sakon-pm25.pages.dev

---

## 2. Architecture Rules

### Tech Stack (Non-Negotiable)
| Layer | Technology |
|-------|------------|
| Framework | Astro (Static Site Generation only) |
| Styling | Tailwind CSS + Custom CSS |
| Data | CCDC API → GitHub Action → JSON file |
| Deployment | Cloudflare Pages |
| Runtime | Zero client-side API calls — all data baked at build time |

### File Organization
- **Components**: `src/components/*.astro` — One component per UI element
- **Data**: `src/data/pm25-history.json` — Auto-generated, do not hand-edit
- **Pages**: `src/pages/*.astro` — Route files
- **Styles**: `src/styles/global.css` — Global styles, font imports
- **Public**: `public/*` — Static assets, OG images

### Forbidden Patterns
- ❌ No React, Vue, or other frameworks — Astro components only
- ❌ No client-side data fetching — all data from local JSON
- ❌ No server-side rendering (SSR) — static output only
- ❌ No API routes in `/pages/api` — this is fully static

---

## 3. Design System Rules

### Colors (From DESIGN.md)

**Static Colors**:
```
Rice Paper White: #FDFCF8    (background)
Lotus Surface: #FFFFFF        (cards)
Charcoal Ink: #1C1917        (primary text)
Smoky Silver: #78716C         (secondary text)
Mist Border: rgba(231,229,228,0.6)  (borders)
Lake Teal: #0D9488           (accent)
```

**Dynamic Colors** (from API `us_color`):
```
AQI 0-50:   #00E400   (Green)
AQI 51-100: #FFFF00   (Yellow)
AQI 101-150: #FF7E00  (Orange)
AQI 151-200: #FF0000  (Red)
AQI 201-300: #8F3F97  (Purple)
AQI 301+:   #7E0023   (Maroon)
```

**Color Rules**:
- NEVER use pure black (`#000000`) — use Charcoal Ink
- Dynamic theming must use API-provided `us_color` field
- Glow effects: 20% opacity, 80px blur, matching AQI color

### Typography

**Font Stack**:
- Display/Headings: `Satoshi` (weight 500-700)
- Body (Thai): `Inter` — ONLY allowed for Thai body text
- Timestamps: `JetBrains Mono`
- NO serif fonts — ever

**Sizing Rules**:
- PM2.5 hero: `clamp(8rem, 20vw, 14rem)`
- Station name: `text-2xl` to `text-3xl`
- Health text minimum: 18px for elderly readability
- Thai text line-height: 1.7-1.8 (more than Latin)

### Layout Rules

**Single-Page Architecture** (in order):
1. Location Header (full width, modest height)
2. PM2.5 Hero (dominant, 60% vertical space)
3. AQI Status Badge (centered, below hero)
4. Health Card (max-width 600px, centered)
5. Last Updated (bottom, minimal)

**Spacing**:
- Section gaps: `clamp(2rem, 5vh, 4rem)`
- Card padding: `2rem` (desktop) → `1.5rem` (mobile)
- NEVER use `px` for layout spacing — `rem` only
- NEVER use `h-screen` — use `min-h-[100dvh]`

**Responsive Breakpoints**:
- Desktop: 1024px+ (asymmetric layout possible)
- Tablet: 768-1023px (centered stack)
- Mobile: <768px (single column, hero 70% viewport)

---

## 4. Content Rules

### Language
- **Primary**: Thai (Thailand)
- **Secondary**: English
- All UI labels bilingual with Thai first

### Tone & Voice
- Clear, informative, respectful
- No alarmist language
- Direct health recommendations from API
- NEVER invent or fake data

### Banned Content Patterns
❌ No emojis (use SVG icons only)
❌ No fake statistics ("99.9% accuracy", "24/7 monitoring")
❌ No AI clichés ("Breathe better", "Clean air awaits")
❌ No `LABEL // YEAR` formatting
❌ No fake social proof ("Trusted by 10,000+ users")
❌ No generic placeholder text

---

## 5. Animation Rules

### Allowed Animations
✅ `transform` and `opacity` only
✅ Spring physics for number transitions (stiffness: 120, damping: 15)
✅ Pulse animation on live indicator (2s cycle)
✅ Subtle glow breathing (opacity 15% → 25%, 4s cycle)
✅ Entry animations with staggered delays

### Banned Animations
❌ Width/height animations (layout thrashing)
❌ Top/left animations (layout thrashing)
❌ Scroll-jacking
❌ Parallax effects
❌ "Scroll to explore" bounce animations
❌ Custom mouse cursors

### Performance Requirements
- Use `will-change: transform` on animated elements
- Disable on `prefers-reduced-motion`
- Respect `prefers-reduced-motion` — always

---

## 6. Component Rules

### AQIStatus Component
- Pill-shaped badge (`rounded-full`)
- Dynamic border and fill from API color
- Thai title primary, English secondary
- Never hardcode status text — always from API

### PM25Hero Component
- Must use API `us_color` for theming
- Glow effect behind number (CSS box-shadow)
- Number counts up/down on data change (spring)
- "PM2.5" label above-left, "μg/m³" below-right

### HealthCard Component
- White background with subtle border
- Icon in Lake Teal (left of text)
- Thai text first, English below
- Max-width constraint for readability

### LastUpdated Component
- Pulse dot: green (<1hr), amber (1-2hr), red (>2hr)
- Thai date format with Buddhist year (พ.ศ.)
- English timestamp below

### LocationHeader Component
- Full Thai station name prominent
- English name in secondary style
- Province badge in Lake Teal

---

## 7. Data Rules

### Data Flow
```
CCDC API → GitHub Action → pm25-history.json → Astro build → Static HTML
```

### GitHub Action Behavior
- Runs hourly at :01 minute (avoid cron congestion)
- Fetches all stations, filters for ID "4473"
- Appends new readings to history
- Keeps last 90 days (2160 hourly readings)
- Commits with timestamp
- Triggers Cloudflare Pages rebuild

### Data File Format
```json
{
  "station": {
    "id": "4473",
    "name_th": "...",
    "name_en": "..."
  },
  "readings": [
    {
      "datetime": "2026-04-11 20:00:00",
      "pm25": 54,
      "us_aqi": 132,
      "us_color": "255,126,0",
      ...
    }
  ],
  "last_updated": "2026-04-11T20:01:00+07:00"
}
```

### Data Handling in Components
- Read from `src/data/pm25-history.json` at build time
- Use most recent reading for display
- Handle missing data gracefully (empty state)
- Never mutate the JSON file — read-only

---

## 8. Code Style Rules

### Astro Components
- Use `.astro` extension
- Frontmatter for TypeScript logic
- Template section for HTML
- Style section scoped when needed

### CSS Rules
- Tailwind for utility classes
- Custom CSS in `global.css` for:
  - Font imports
  - CSS variables (design tokens)
  - Keyframe animations
  - Component base styles

### Naming Conventions
- Components: PascalCase (`PM25Hero.astro`)
- Files: kebab-case for non-components
- CSS classes: kebab-case
- Variables: camelCase

### Accessibility
- WCAG AA compliance (4.5:1 contrast minimum)
- Semantic HTML structure
- `prefers-reduced-motion` respected
- Thai text minimum 18px for readability

---

## 9. Testing Rules

### Before Committing
1. `npm run build` — must succeed
2. `npm run preview` — visual check
3. Check both desktop and mobile widths
4. Verify Thai text renders correctly
5. Confirm no console errors

### Edge Cases to Test
- No data available (empty state)
- Stale data (>2 hours old)
- API error (graceful degradation)
- Mobile viewport (< 400px)
- Different AQI levels (color theming)

---

## 10. Deployment Rules

### Build Output
- Static files in `dist/` directory
- No server-side code
- All data embedded in HTML at build time

### Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20

### Post-Deploy Checklist
- [ ] Site loads at pages.dev URL
- [ ] HTTPS working
- [ ] All assets load (no 404s)
- [ ] Mobile responsive
- [ ] Data displays correctly
- [ ] Thai text readable

---

## 11. Reference Documents

Always read these when making changes:

1. **DESIGN.md** — Visual design system, colors, typography, motion
2. **.plan/sakon-pm25-dashboard.md** — Full project plan and requirements
3. **This file (AGENTS.md)** — You are here

---

## 12. Quick Decision Tree

**Adding a new component?**
→ Check DESIGN.md for styling
→ One component per file in `src/components/`
→ Must work on mobile
→ No emojis, use SVG

**Changing data flow?**
→ Check GitHub Action workflow
→ Don't break the JSON structure
→ Ensure backward compatibility

**Updating styles?**
→ Verify against DESIGN.md colors
→ Check mobile breakpoint
→ Test Thai text rendering
→ Ensure contrast ratios

**Adding animation?**
→ Use transform/opacity only
→ Add prefers-reduced-motion support
→ Keep it subtle (purposeful, not decorative)

---

## 13. Contact & Context

**Project Owner**: peerasak-u
**Purpose**: Community tool for Sakon Nakhon residents and visitors
**Data Source**: CCDC Station 4473
**Live Site**: https://sakon-pm25.pages.dev

When in doubt, prioritize:
1. **Clarity** — User understands in 3 seconds
2. **Accuracy** — Real data, never fake
3. **Performance** — Fast load, smooth animations
4. **Accessibility** — Works for everyone

---

*Last updated: 2026-04-11*
*Agent rules version: 1.0*
