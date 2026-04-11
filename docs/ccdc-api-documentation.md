# CCDC DustBoy API Documentation

> **Source:** https://open-api.cmuccdc.org/  
> **Version:** 1.0  
> **Organization:** Climate Change Data Center, Chiang Mai University (CCDC CMU)

---

## Terms of Use

### General Public
- **Limit:** Max 10 stations per account
- **Special Access:** Contact CCDC for more

### Data Scope
- **Outdoor stations only**
- Indoor data requires approval

### Attribution Required
Must display one of:
- `"Data supported by Climate Change Data Center, Chiang Mai University (CCDC CMU)"`
- `"Data from DustBoy air quality monitors"`
- DustBoy or CCDC CMU logo

> ⚠️ **Warning:** API access may be suspended without notice if attribution is missing.

---

## Air Quality Index (AQI)

Represents 6 pollutants in one value:

| Pollutant | Description |
|-----------|-------------|
| **PM2.5** | ≤2.5 microns. From vehicles, burning, industry. Enters lungs. |
| **PM10** | ≤10 microns. From combustion, construction. Affects respiratory system. |
| **O3** | Ground ozone. Eye irritation, reduces lung function. |
| **CO** | Carbon monoxide. Reduces oxygen delivery, causes fatigue. |
| **NO2** | Nitrogen dioxide. Affects vision, respiratory issues. |
| **SO2** | Sulfur dioxide. Irritates eyes, skin, respiratory system. |

### Thai AQI (5 Levels)

| AQI | PM2.5 | PM10 | Level | Advice |
|-----|-------|------|-------|--------|
| 0-25 | 0-15 | 0-50 | 🟢 Excellent | Normal activities |
| 26-50 | 15-25 | 51-80 | 🟢 Good | Normal activities |
| 51-100 | 25-38 | 81-120 | 🟡 Moderate | At-risk: reduce outdoor time if symptoms |
| 101-200 | 38-75 | 121-180 | 🟠 Unhealthy | At-risk: reduce outdoor time, use protection |
| >200 | >75 | >180 | 🔴 Very Unhealthy | Everyone: avoid outdoors |

**Thai Pollutant Equivalents:**

| AQI | PM2.5 | PM10 | O3 | CO | NO2 | SO2 |
|-----|-------|------|----|----|-----|-----|
| 0-25 | 0-15 | 0-50 | 0-35 | 0-4.4 | 0-60 | 0-100 |
| 26-50 | 15-25 | 51-80 | 36-50 | 4.5-6.4 | 61-106 | 101-200 |
| 51-100 | 25-38 | 81-120 | 51-70 | 6.5-9.0 | 107-170 | 201-300 |
| 101-200 | 38-75 | 121-180 | 71-120 | 9.1-30 | 171-340 | 301-400 |

**Averaging Periods:**
- PM2.5/PM10: 24-hour
- O3/CO: 8-hour
- NO2/SO2: 1-hour

### US-EPA 2016 AQI (6 Levels)

| AQI | PM2.5 | PM10 | Level | Advice |
|-----|-------|------|-------|--------|
| 0-50 | 0-12 | 0-54 | 🟢 Good | Normal |
| 51-100 | 13-35 | 55-154 | 🟡 Moderate | At-risk: reduce exertion |
| 101-150 | 36-55 | 155-254 | 🟠 Unhealthy for Sensitive | At-risk: reduce outdoor time |
| 151-200 | 56-150 | 255-354 | 🔴 Unhealthy | Everyone: reduce exertion |
| 201-300 | 151-250 | 355-424 | 🟣 Very Unhealthy | At-risk: avoid all outdoors |
| 301-500 | 251-500 | 425-604 | 🟤 Hazardous | Everyone: stay indoors |

**US Pollutant Equivalents:**

| AQI | PM2.5 | PM10 | O3 | CO | NO2 | SO2 |
|-----|-------|------|----|----|-----|-----|
| 0-50 | 0-12 | 0-54 | 0-34 | 0-4.4 | 0-53 | 0-35 |
| 51-100 | 13-35 | 55-154 | 55-70 | 4.5-9.4 | 54-100 | 36-75 |
| 101-150 | 36-55 | 155-254 | 71-85 | 9.5-12.4 | 101-360 | 76-185 |
| 151-200 | 56-150 | 255-354 | 86-105 | 12.5-15.4 | 364-649 | 186-304 |
| 201-300 | 151-250 | 355-424 | 106-200 | 15.5-30.4 | 650-1249 | 305-604 |
| 301-500 | 251-500 | 425-604 | — | 30.5-50.4 | 1250-2049 | 605-1004 |

### AQI Formula

```
(I - Ii) / (Ij - Ii) = (X - Xi) / (Xj - Xi)
```

Where: I=sub-index, X=measured concentration, i=lower bound, j=upper bound

---

## API Authentication

Use `apikey` after registration:

```
GET /api/Docs?apikey={apikey}
```

**Response:**
```json
{"status": true, "message": "welcome CMUCCDC APIs Datas :)"}
```

### Access Levels

| Endpoint | Public | Student | Civil | Private | Govt | MOU |
|----------|:------:|:-------:|:-----:|:-------:|:----:|:---:|
| By station | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| By province | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| By health region | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| By geography | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| All stations | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| By location | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| 30-day history | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| 1-year history | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| 5-year history | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Full database | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

## API Endpoints

### Real-time Hourly Data

| Endpoint | Description | Params |
|----------|-------------|--------|
| `GET /api/dustboy/station?apikey={apikey}` | By station | Configure at `/setting` |
| `GET /api/dustboy/province?apikey={apikey}` | By province | Configure at `/setting` |
| `GET /api/dustboy/areahealth?apikey={apikey}` | By health region | Configure at `/setting` |
| `GET /api/dustboy/geography?apikey={apikey}` | By geography | Configure at `/setting` |
| `GET /api/dustboy/stations?apikey={apikey}` | All stations | — |
| `GET /api/dustboy/nearme/{lat}/{lon}/{dist}?apikey={apikey}` | Nearby stations | lat, lon, distance (max 20km) |

### Historical Data

| Endpoint | Description | Params |
|----------|-------------|--------|
| `GET /api/dustboy/data30day/{id}/apikey={apikey}` | 30 days | id=station ID |
| `GET /api/dustboy/data1year/{id}/apikey={apikey}` | 1 year | id=station ID |
| `GET /api/dustboy/data5year/{id}/apikey={apikey}` | 5 years | id=station ID |
| `GET /api/dustboy/database/{yyyy}{mm}/apikey={apikey}` | Full month | yyyy=year, mm=month |

**Available:** 2023 (09-12), 2024 (01-12), 2025 (01-12), 2026 (01-04)

---

## Registration

1. **Register:** Fill form with correct organization
2. **Verify:** Confirm via email
   - Students/Researchers, Civil Society, Private Sector, Government, MOU partners need admin approval
3. **Login:** Use email and password

---

## Contact

- 📧 dustboy.3e@gmail.com
- 📞 064-069-1698

**Links:** https://www.cmuccdc.org | https://open-api.cmuccdc.org/

---

*© 2023 CCDC CMU. All Rights Reserved.*
