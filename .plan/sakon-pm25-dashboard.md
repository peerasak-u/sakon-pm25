# Sakon Nakhon PM2.5 Dashboard

## Problem Statement
People in Sakon Nakhon who want to visit Srisanakarin Park (near Nong Han lake) need a simple way to check current air quality before going outside. The existing air quality data sources are either too complex or not focused on this specific location.

## Solution Overview
Build a minimal, Clean Modern Dashboard website that displays real-time PM2.5 data from station 4473 (สวนสมเด็จพระศรีนครินทร์ สระพังทอง). Use GitHub Actions to fetch data hourly and store historical records, with Cloudflare Pages handling deployment via webhook.

## Technical Design

### Architecture
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

### Key Decisions
| Decision | Rationale |
|----------|-----------|
| Astro SSG | Fast static builds, can read local data files at build time, minimal JS |
| GitHub Actions at xx:01 | Avoids rate limits, builds historical dataset, avoids cron congestion |
| API returns array, filter by ID | CCDC API returns all stations; we filter client-side for station 4473 |
| Use US AQI standard (`us_*` fields) | More internationally recognized, provides RGB colors directly |
| Store historical data | Enables future trend features while keeping current UI minimal |
| Bilingual (TH+EN) | Serves both locals and tourists visiting Nong Han area |
| OG image generation | Makes shares on social media look professional and informative |
| Static site approach | Zero runtime API calls, instant page loads, works offline after first visit |

## Implementation Location

**Primary files:**
- `.github/workflows/update-data.yml` — GitHub Action workflow
- `src/data/pm25-history.json` — Accumulated historical data
- `src/pages/index.astro` — Main dashboard page
- `src/components/PMDisplay.astro` — PM2.5 display component
- `astro.config.mjs` — Astro configuration

**Related files:**
- `package.json` — Dependencies
- `public/og-image.jpg` — Generated OG image (or dynamic generation)

## Code Changes Required

### Step 1: Project Setup
Initialize Astro project with static output configuration.

### Step 2: GitHub Action Workflow
Create workflow that:
- Runs hourly at :01 minute (e.g., 08:01, 09:01)
- Calls CCDC API endpoint (returns array of all stations)
- Filters for station `id: "4473"` from the response array
- Extracts: `pm25`, `us_aqi`, `us_title`, `us_caption`, `us_color`, `log_datetime`
- Appends to `src/data/pm25-history.json`
- Commits and pushes changes
- Triggers Cloudflare Pages rebuild via webhook

### Step 3: Dashboard UI
Build Clean Modern Dashboard with:
- Large PM2.5 value display with color coding
- AQI level indicator (Good/Moderate/Unhealthy)
- Last updated timestamp (Thai format)
- Simple health recommendation text
- Bilingual labels

### Step 4: OG Image
Generate or create static OG image showing:
- Location name (สวนสมเด็จพระศรีนครินทร์ / Srisanakarin Park)
- Current PM2.5 value
- Visual air quality indicator

### Step 5: Cloudflare Pages Integration
Configure webhook deployment trigger in Cloudflare dashboard.

## Testing Strategy

**Manual tests:**
1. Verify GitHub Action runs successfully and commits data
2. Check that Astro builds correctly with data file
3. Confirm page displays correct PM2.5 value
4. Test Thai/English language display
5. Verify OG image appears when sharing URL
6. Test on mobile device (primary use case)

**Edge case tests:**
- API returns error or no data
- History file grows large over time
- Build with missing/corrupt data file

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| API unavailable | Display "Data unavailable" with last known update time |
| Station 4473 not in API array | Log error in Action, use last known data |
| No historical data yet | Show empty state, start collecting |
| History file > 10MB | Implement data rotation (keep last 90 days) |
| Build triggered without new data | Show cached data with clear timestamp |
| CCDC API format changes | Graceful error, alert via Action failure |
| `us_color` missing or malformed | Fallback to computed color based on AQI range |

## Data Format

### CCDC API Response (Station 4473)
```json
[
  {
    "id": "4473",
    "dustboy_id": "DustBoy CCXXX",
    "dustboy_project": "default",
    "dustboy_uri": "srisanakarin-park",
    "dustboy_name": "สวนสมเด็จพระศรีนครินทร์ (สระพังทอง) ต.ธาตุเชิงชุม อ.เมือง จ.สกลนคร",
    "dustboy_name_en": "Srisanakarin Park (Saphang Thong), Sakon Nakhon",
    "dustboy_lat": "17.1234567",
    "dustboy_lon": "103.1234567",
    "pm10": 45,
    "pm25": 25,
    "wind_speed": "1.5",
    "wind_direction": "NE",
    "atmospheric": "1013",
    "pm10_th_aqi": 52.5,
    "pm10_us_aqi": "48",
    "pm25_th_aqi": 78,
    "pm25_us_aqi": "82",
    "temp": "28",
    "humid": "65",
    "us_aqi": "82",
    "us_color": "255,255,0",
    "us_dustboy_icon": "us-dust-boy-02",
    "us_title": "คุณภาพอากาศปานกลาง",
    "us_title_en": "Moderate",
    "us_caption": "ประชาชนทั่วไปควรเฝ้าระวังสุขภาพ...",
    "us_caption_en": "Air quality is acceptable...",
    "th_aqi": 78,
    "th_color": "255,255,0",
    "th_dustboy_icon": "th-dust-boy-02",
    "th_title": "คุณภาพอากาศปานกลาง",
    "th_title_en": "Moderate",
    "th_caption": "ประชาชนทั่วไปควรเฝ้าระวังสุขภาพ...",
    "th_caption_en": "Air quality is acceptable...",
    "daily_pm10": 48,
    "daily_pm10_th_aqi": 55.2,
    "daily_pm10_us_aqi": "51",
    "daily_pm25": 28,
    "daily_pm25_th_aqi": 82,
    "daily_pm25_us_aqi": "88",
    "daily_th_title": "คุณภาพอากาศปานกลาง",
    "daily_th_title_en": "Moderate",
    "daily_us_title": "คุณภาพอากาศปานกลาง",
    "daily_us_title_en": "Moderate",
    "daily_th_caption": "ประชาชนทั่วไปควรเฝ้าระวังสุขภาพ...",
    "daily_th_caption_en": "Air quality is acceptable...",
    "daily_us_caption": "ประชาชนทั่วไปควรเฝ้าระวังสุขภาพ...",
    "daily_us_caption_en": "Air quality is acceptable...",
    "daily_th_color": "255,255,0",
    "daily_us_color": "255,255,0",
    "daily_th_dustboy_icon": "th-dust-boy-02",
    "daily_us_dustboy_icon": "us-dust-boy-02",
    "daily_temp": "29",
    "daily_humid": "63",
    "daily_wind_speed": "1.8",
    "daily_wind_direction": "NE",
    "daily_atmospheric": "1012",
    "province_id": "47",
    "log_datetime": "2026-04-11 19:00:00"
  }
]
```

### Fields to Display
| Field | Usage |
|-------|-------|
| `pm25` | Primary PM2.5 value (large display) |
| `us_aqi` | US AQI standard for color coding |
| `us_title` / `us_title_en` | Status label (Thai primary, English secondary) |
| `us_caption` / `us_caption_en` | Health recommendation text |
| `us_color` | RGB color string for UI theming (e.g., "255,255,0") |
| `log_datetime` | Last update timestamp |
| `dustboy_name` / `dustboy_name_en` | Station name |

### Stored History Format
```json
{
  "station": {
    "id": "4473",
    "dustboy_id": "DustBoy CCXXX",
    "name_th": "สวนสมเด็จพระศรีนครินทร์ (สระพังทอง)",
    "name_en": "Srisanakarin Park (Saphang Thong)",
    "province_id": "47",
    "lat": "17.1234567",
    "lon": "103.1234567"
  },
  "readings": [
    {
      "datetime": "2026-04-11 19:00:00",
      "pm25": 25,
      "pm10": 45,
      "us_aqi": 82,
      "th_aqi": 78,
      "us_color": "255,255,0",
      "temp": "28",
      "humid": "65"
    }
  ],
  "last_updated": "2026-04-11T19:01:23+07:00"
}
```

## Future Extensions (Out of Scope)

- 24-hour trend chart from historical data
- 7-day average calculation
- Push notifications when unhealthy levels detected
- Additional stations in Sakon Nakhon province
- Weather data integration
- PWA offline support

## AQI Color Scale (US Standard)

Uses `us_aqi` and `us_color` from API (RGB format: "R,G,B"):

| US AQI | PM2.5 (μg/m³) | Level | RGB Color | API Icon | Dashboard Style |
|--------|---------------|-------|-----------|----------|-----------------|
| 0-50 | 0-12.0 | Good | 0,228,0 | us-dust-boy-01 | 🟢 Green glow, safe message |
| 51-100 | 12.1-35.4 | Moderate | 255,255,0 | us-dust-boy-02 | 🟡 Yellow, caution message |
| 101-150 | 35.5-55.4 | Unhealthy for Sensitive | 255,126,0 | us-dust-boy-03 | 🟠 Orange, sensitive warning |
| 151-200 | 55.5-150.4 | Unhealthy | 255,0,0 | us-dust-boy-04 | 🔴 Red, avoid outdoor message |
| 201-300 | 150.5-250.4 | Very Unhealthy | 143,63,151 | us-dust-boy-05 | 🟣 Purple, stay indoors |
| 301+ | 250.5+ | Hazardous | 126,0,35 | us-dust-boy-06 | 🔴 Maroon, emergency warning |

### API Color Usage
- Use `us_color` directly for dynamic theming: `rgb(${us_color})`
- Use `us_title` for status text (Thai: "คุณภาพอากาศดี", English: "Good")
- Use `us_caption` for health recommendation (full sentence)

## Acceptance Criteria

- [ ] GitHub Action fetches data hourly at :01 minute
- [ ] Data is stored and accumulated in `src/data/pm25-history.json`
- [ ] Dashboard displays current PM2.5 with color-coded AQI level
- [ ] Last updated timestamp shows in Thai format
- [ ] Bilingual labels (Thai primary, English secondary)
- [ ] OG image displays correctly when sharing on social media
- [ ] Website deploys automatically to Cloudflare Pages on each data update
- [ ] Mobile-responsive design works on phones
- [ ] Page loads in under 1 second
- [ ] Build process works locally and in CI
