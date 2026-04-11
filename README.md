# Sakon PM2.5 Dashboard

[![Deploy Status](https://img.shields.io/badge/deployed-cloudflare.pages.dev-blue)](https://sakon-pm25.pages.dev)
[![Data Source](https://img.shields.io/badge/data-CCDC-green)](https://open-api.cmuccdc.org/)

Real-time PM2.5 air quality dashboard for Srisanakarin Park (สวนสมเด็จพระศรีนครินทร์), Sakon Nakhon, Thailand. Built for quick decision-making — know in 3 seconds if it's safe to go outside.

**🌐 Live Site**: https://sakon-pm25.pages.dev

---

## Overview

A minimal, single-focus dashboard displaying current PM2.5 data from CCDC station 4473. Designed for visitors to Srisanakarin Park near Nong Han lake who need immediate air quality information before outdoor activities.

### Key Features

- ⚡ **Instant PM2.5 reading** — Giant, color-coded display
- 🎨 **Dynamic AQI theming** — UI changes color based on air quality level
- 🇹🇭 **Bilingual** — Thai primary, English secondary
- 📱 **Mobile-first** — Optimized for on-the-go checking
- 🔄 **Auto-updating** — Hourly data refresh via GitHub Actions
- 🖼️ **Social sharing** — OG image for link previews

---

## Architecture

```
┌─────────────────┐     ┌─────────────┐     ┌─────────────────┐
│  GitHub Actions │────▶│  GitHub Repo│────▶│ Cloudflare Pages│
│  (hourly fetch) │     │ (data.json) │     │ (Astro static)  │
└─────────────────┘     └─────────────┘     └─────────────────┘
         │                                            │
         │                                            │
         ▼                                            ▼
┌─────────────────┐                         ┌─────────────────┐
│  CCDC API       │                         │  Users (Thai/   │
│  Station 4473   │                         │  English)       │
└─────────────────┘                         └─────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Astro](https://astro.build) — Static Site Generator |
| Styling | Tailwind CSS + Custom Design Tokens |
| Data Source | CCDC Open API (Station 4473) |
| Deployment | Cloudflare Pages |
| CI/CD | GitHub Actions (hourly data fetch) |
| Fonts | Satoshi, Inter, JetBrains Mono |

---

## Project Structure

```
.
├── .github/workflows/
│   └── update-data.yml      # Hourly data fetch + deploy trigger
├── src/
│   ├── components/          # Astro components
│   │   ├── AQIStatus.astro      # Status badge with Thai/English
│   │   ├── HealthCard.astro     # Health recommendation display
│   │   ├── LastUpdated.astro    # Timestamp with freshness pulse
│   │   ├── LocationHeader.astro # Station name display
│   │   └── PM25Hero.astro       # Giant PM2.5 display with glow
│   ├── data/
│   │   └── pm25-history.json    # Accumulated historical data
│   ├── layouts/
│   │   └── Layout.astro         # Base HTML layout
│   ├── pages/
│   │   └── index.astro          # Main dashboard page
│   └── styles/
│       └── global.css           # Global styles + fonts
├── public/
│   └── og/                      # OG images for social sharing
├── astro.config.mjs         # Astro configuration
├── wrangler.jsonc           # Cloudflare Pages config
├── DESIGN.md                # Design system documentation
└── README.md                # This file
```

---

## Development

### Prerequisites

- Node.js 20+
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/peerasak-u/sakon-pm25.git
cd sakon-pm25

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server will start at `http://localhost:4321`

### Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

---

## Data Pipeline

### GitHub Action Workflow

The `.github/workflows/update-data.yml` runs every hour at :01 minute:

1. Fetches data from CCDC API
2. Filters for station 4473
3. Appends to `src/data/pm25-history.json`
4. Commits and pushes changes
5. Triggers Cloudflare Pages rebuild (if deploy hook configured)

### API Data Fields Used

| Field | Usage |
|-------|-------|
| `pm25` | Primary value (large display) |
| `us_aqi` | US AQI standard for color coding |
| `us_title` / `us_title_en` | Status label |
| `us_caption` / `us_caption_en` | Health recommendation |
| `us_color` | RGB color for dynamic theming |
| `log_datetime` | Last update timestamp |
| `dustboy_name` / `dustboy_name_en` | Station name |

---

## Design System

See [DESIGN.md](./DESIGN.md) for complete design specifications.

### Quick Reference

**Colors**:
- Rice Paper White (#FDFCF8) — Background
- Charcoal Ink (#1C1917) — Text
- Dynamic AQI colors from API

**Typography**:
- Satoshi — Display and headings
- Inter — Body text (Thai optimized)
- JetBrains Mono — Timestamps

**Layout**:
- Single-page, vertical stack
- Hero element: Giant PM2.5 number
- Mobile-first, responsive

---

## Deployment

### Cloudflare Pages Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
2. Create project → Connect to GitHub
3. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Save and deploy

### Optional: Deploy Hook

For automatic rebuilds when data updates:

1. In Pages settings → Deploy Hooks
2. Create hook named "GitHub Action Trigger"
3. Add to GitHub repository secrets as `CLOUDFLARE_DEPLOY_HOOK`

---

## Environment Variables

Required for GitHub Action (repository secrets):

| Secret | Description |
|--------|-------------|
| `CCDC_API_URL` | CCDC API endpoint |
| `CCDC_API_KEY` | CCDC API key |
| `CLOUDFLARE_DEPLOY_HOOK` | (Optional) Pages deploy hook URL |

No environment variables needed for the static site itself — all data is baked at build time.

---

## Contributing

This is a personal project for the Sakon Nakhon community. Suggestions welcome via issues.

---

## License

MIT License — Feel free to adapt for other locations.

---

## Acknowledgments

- Data provided by [CCDC (CMU Climate Change Data Center)](https://open-api.cmuccdc.org/)
- Station 4473: สวนสมเด็จพระศรีนครินทร์ (สระพังทอง)
- Built with Astro and deployed on Cloudflare Pages
