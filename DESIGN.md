# Design System: Sakon PM2.5 Dashboard

## 1. Visual Theme & Atmosphere

A **clean, airy dashboard** with **single-focus clarity** designed for immediate decision-making. The atmosphere is **calm yet informative** — like a well-designed weather app that respects the user's time. 

**Intent**: Help park visitors in Sakon Nakhon decide in under 3 seconds whether it's safe to go outside.

**Character**:
- **Density**: 3/10 (Art Gallery Airy) — generous whitespace, one primary metric
- **Variance**: 5/10 (Balanced Asymmetry) — content-weighted left, visual breathing room right  
- **Motion**: 4/10 (Subtle Fluid) — gentle pulse on live indicator, smooth number transitions
- **Context**: Nature/park aesthetic with earthy warmth, professional public health credibility

The hero element is the **giant PM2.5 number** that dominates the viewport, dynamically colored by the air quality API. Everything else serves this single metric.

## 2. Color Palette & Roles

### Base Palette (Static)
| Name | Hex | Role |
|------|-----|------|
| **Rice Paper White** | #FDFCF8 | Primary background — warm off-white, evokes Thai temple walls |
| **Lotus Surface** | #FFFFFF | Card backgrounds, elevated containers |
| **Charcoal Ink** | #1C1917 | Primary text — near-black with warmth |
| **Smoky Silver** | #78716C | Secondary text, metadata, timestamps |
| **Mist Border** | rgba(231,229,228,0.6) | 1px dividers, subtle separation |
| **Lake Teal** | #0D9488 | Accent — Nong Han lake reference, non-neon, trustworthy |

### Dynamic Palette (API-Driven)
The PM2.5 display uses **dynamic theming** based on CCDC API's `us_color` field:

| US AQI | PM2.5 | Color | Display Treatment |
|--------|-------|-------|-------------------|
| 0-50 | 0-12 | `#00E400` | Fresh Green glow, "Safe to explore" |
| 51-100 | 12-35 | `#FFFF00` | Soft Yellow, "Okay for light activity" |
| 101-150 | 35-55 | `#FF7E00` | Warm Orange, "Sensitive groups beware" |
| 151-200 | 55-150 | `#FF0000` | Alert Red, "Stay indoors" |
| 201-300 | 150-250 | `#8F3F97` | Deep Purple, "Hazardous — avoid outdoors" |
| 301+ | 250+ | `#7E0023` | Maroon, "Emergency conditions" |

**Dynamic Implementation**: The entire hero section subtly shifts its ambient glow and text color to match the API-provided RGB value. The base `Lake Teal` accent remains for UI elements (links, buttons, focus states).

## 3. Typography Rules

**Dashboard Constraint**: Sans-serif only. Clean, modern, highly legible for quick scanning.

| Role | Font | Treatment |
|------|------|-----------|
| **Display (PM2.5 Hero)** | `Satoshi` | Weight 700, tracking -0.02em, massive scale (clamp 8rem to 14rem). The number fills 60% of viewport height on mobile. |
| **Headings (Station Name)** | `Satoshi` | Weight 500, tracking -0.01em, `text-2xl`/`text-3xl` |
| **Body (Health Text)** | `Inter` | Weight 400, relaxed leading (1.6), max 55ch for Thai readability. Exception to "no Inter" rule for body text in Thai language contexts where legibility trumps aesthetics. |
| **Metadata (Timestamp)** | `JetBrains Mono` | Weight 400, uppercase for time codes, `text-sm` |
| **Labels (AQI Status)** | `Satoshi` | Weight 600, all-caps, letter-spacing 0.05em |

**Thai Typography Notes**:
- Thai text requires more line-height (1.7-1.8) than Latin text
- Health recommendations (`us_caption`) should be 18px minimum for elderly users
- Use Thai numerals (๐-๙) for the timestamp date, Arabic numerals for PM2.5 value

## 4. Component Stylings

### PM2.5 Hero Display
The single most important element:
- **Size**: 40-60% of viewport, centered but slightly top-weighted (55/45 split)
- **Color**: Dynamic from API `us_color` — fills the number with this color
- **Glow**: Soft ambient glow behind the number matching the AQI color (20% opacity, 80px blur)
- **Label**: "PM2.5" in Smoky Silver, positioned above-left of the number, small caps
- **Unit**: "μg/m³" in Smoky Silver, positioned below-right, smaller

### AQI Status Badge
- **Shape**: Pill-shaped, `rounded-full`, generous padding (1rem 2rem)
- **Fill**: Dynamic color at 10% opacity, with 1px border in the same color at 50%
- **Text**: `us_title` (Thai) in Dynamic color, weight 600
- **English**: `us_title_en` below in Smoky Silver, smaller, weight 400

### Health Recommendation Card
- **Background**: Lotus Surface with subtle Mist Border
- **Border Radius**: 1.5rem (24px)
- **Shadow**: None — flat, clean
- **Padding**: 2rem
- **Content**: `us_caption` (Thai primary), `us_caption_en` (English secondary below)
- **Icon**: Small lung/leaf icon in Lake Teal, positioned left of text

### Location Header
- **Station Name**: "สวนสมเด็จพระศรีนครินทร์" in Charcoal Ink
- **English**: "Srisanakarin Park" in Smoky Silver below
- **Province**: "สกลนคร / Sakon Nakhon" badge in Lake Teal

### Last Updated Indicator
- **Icon**: Small pulse dot (green when fresh <1hr, amber when 1-2hr, red when stale >2hr)
- **Text**: "อัปเดตล่าสุด / Last updated" + timestamp in JetBrains Mono
- **Position**: Bottom of viewport, centered, subtle

### Share Button (for OG Image)
- **Style**: Ghost button with Lake Teal text and border
- **Icon**: Share arrow
- **Position**: Top-right corner on desktop, bottom-center on mobile

## 5. Layout Principles

**Single-Page Architecture**:
1. **Location Header** (top, full-width, modest height)
2. **PM2.5 Hero** (center, dominant, 60% of vertical space)
3. **AQI Status Badge** (below hero, centered)
4. **Health Card** (below status, max-width 600px, centered)
5. **Last Updated** (bottom, minimal)

**Responsive Strategy**:
- **Desktop (1024px+)**: Asymmetric layout with hero slightly left, health card floating right
- **Tablet (768-1023px)**: Centered stack, hero still dominant
- **Mobile (<768px)**: Single column, hero takes 70% of initial viewport, scroll for health details

**Spacing System**:
- Section gaps: `clamp(2rem, 5vh, 4rem)`
- Card padding: `2rem` (desktop) → `1.5rem` (mobile)
- Never use `px` units for layout spacing — `rem` only

**Containment**:
- Max-width: 1200px centered
- Full-bleed background color (Rice Paper White)

## 6. Motion & Interaction

**Spring Physics** (for number transitions):
- `stiffness: 120`, `damping: 15` — snappy but smooth
- When new data loads, the PM2.5 number counts up/down with spring physics

**Perpetual Micro-Interactions**:
- **Live Indicator**: Gentle pulse animation on the "Last Updated" dot (2s cycle, ease-in-out)
- **Status Badge**: Subtle shimmer sweep when data refreshes
- **Glow Effect**: The hero number's ambient glow slowly breathes (opacity 15% → 25%, 4s cycle)

**Entry Animation** (page load):
1. Background fades in (opacity 0→1, 300ms)
2. PM2.5 number scales up from 0.9 with spring (400ms delay)
3. Status badge slides up from +20px (500ms delay, 200ms stagger)
4. Health card fades up (600ms delay)
5. Timestamp appears last (800ms delay)

**Performance Rules**:
- Animate only `transform` and `opacity`
- No layout-triggering animations (width, height, top, left)
- Use `will-change: transform` on the hero number
- Disable complex animations on `prefers-reduced-motion`

## 7. Anti-Patterns (Banned)

**Design Bans**:
- No emojis anywhere (use SVG icons only)
- No purple or neon accents (the "AI aesthetic")
- No pure black (`#000000`) — use Charcoal Ink
- No 3-column equal grids (this is a single-focus dashboard)
- No centered hero when variance >4 — use top-weighted asymmetric
- No "Scroll to explore" or chevron bounce animations
- No overlapping elements — clean spatial separation

**Content Bans**:
- No fake statistics or invented data ("99.9% accuracy", "24/7 monitoring")
- No `LABEL // YEAR` formatting ("PM2.5 // 2024")
- No AI copywriting clichés ("Breathe better", "Clean air awaits", "Your health matters")
- No generic placeholder text (use real station names and Thai text)
- No fake social proof ("Trusted by 10,000+ users")

**Technical Bans**:
- No `Inter` for display text (only allowed for Thai body text)
- No serif fonts of any kind
- No custom mouse cursors
- No horizontal scroll on mobile
- No broken image links — use inline SVG or CSS shapes
- No `h-screen` — use `min-h-[100dvh]` for mobile viewport

## 8. OG Image Specifications

The shareable OG image should be auto-generated or pre-rendered with:
- **Background**: Gradient from Rice Paper White to subtle API color tint
- **Hero Number**: Large PM2.5 value in dynamic color
- **Status**: "Unhealthy" / "คุณภาพอากาศไม่ดี" badge
- **Location**: "Srisanakarin Park, Sakon Nakhon"
- **Branding**: Minimal "sakon.dust" wordmark in corner
- **Dimensions**: 1200×630px (Facebook/Twitter standard)

## 9. Accessibility Notes

- All color combinations must meet WCAG AA (4.5:1 for text)
- Dynamic AQI colors maintain contrast against Rice Paper White background
- Health recommendations minimum 18px for readability
- `prefers-reduced-motion` disables all animations except the live indicator pulse
- Thai text tested with native speakers for natural phrasing
