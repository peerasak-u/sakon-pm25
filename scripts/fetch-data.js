#!/usr/bin/env node
/**
 * Local script to test CCDC API connection
 * Usage: node scripts/fetch-data.js
 * Or with env: CCDC_API_URL=xxx CCDC_API_KEY=yyy node scripts/fetch-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if exists
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match && match[2].trim()) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
    console.log('✓ Loaded .env file');
  }
} catch (e) {
  // ignore
}

// Configuration
const API_URL = process.env.CCDC_API_URL?.replace(/#.*/, '').trim(); // Remove comments
const API_KEY = process.env.CCDC_API_KEY;
const STATION_ID = process.env.STATION_ID || '4473';
const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'pm25-history.json');

console.log('====================================');
console.log('CCDC API Test Script');
console.log('====================================\n');

// Validate config
if (!API_URL) {
  console.error('❌ Error: CCDC_API_URL not set');
  console.log('Create .env file from .env.sample or set env variable');
  process.exit(1);
}

if (!API_KEY) {
  console.error('❌ Error: CCDC_API_KEY not set');
  console.log('Create .env file from .env.sample or set env variable');
  process.exit(1);
}

console.log('Configuration:');
console.log(`  API URL: ${API_URL}`);
console.log(`  API Key: ${API_KEY.substring(0, 8)}...`);
console.log(`  Station ID: ${STATION_ID}`);
console.log(`  Data File: ${DATA_FILE}\n`);

// Build full URL
const fullUrl = `${API_URL}?apikey=${API_KEY}`;
console.log(`Fetching: ${API_URL}?apikey=***\n`);

// Fetch data with proper headers
async function fetchData() {
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Fetch failed: ${error.message}`);
    
    if (error.message.includes('403')) {
      console.log('\n⚠️  403 Forbidden - Possible causes:');
      console.log('   1. API key is invalid or expired');
      console.log('   2. Account not approved yet (check email)');
      console.log('   3. Using /station endpoint without configuring station 4473');
      console.log('\n   Visit: https://open-api.cmuccdc.org/setting');
    }
    
    if (error.message.includes('401')) {
      console.log('\n⚠️  401 Unauthorized - API key is invalid');
    }
    
    process.exit(1);
  }
}

// Find station in data
function findStation(data, id) {
  if (Array.isArray(data)) {
    console.log(`Response is array with ${data.length} stations`);
    const station = data.find(s => s.id === id);
    if (!station) {
      console.error(`❌ Station ${id} not found in response`);
      console.log('\nAvailable stations (first 10):');
      data.slice(0, 10).forEach(s => {
        console.log(`  - ${s.id}: ${s.dustboy_name}`);
      });
      return null;
    }
    return station;
  } else if (data && typeof data === 'object') {
    console.log('Response is single station object');
    if (data.id === id) {
      return data;
    }
    if (data.error) {
      console.error(`❌ API Error: ${data.error}`);
      return null;
    }
    console.error(`❌ Configured station is ${data.id}, expected ${id}`);
    console.log(`   Current: ${data.dustboy_name || 'unknown'}`);
    console.log('\n   Please configure station 4473 at:');
    console.log('   https://open-api.cmuccdc.org/setting');
    return null;
  } else {
    console.error('❌ Invalid response format:', typeof data);
    return null;
  }
}

// Load existing history
function loadHistory() {
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.log('Creating new history file');
    return {
      station: {
        id: STATION_ID,
        name_th: "สวนสมเด็จพระศรีนครินทร์ (สระพังทอง)",
        name_en: "Srisanakarin Park (Saphang Thong)"
      },
      readings: [],
      last_updated: ""
    };
  }
}

// Save history
function saveHistory(history) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(history, null, 2) + '\n');
}

// Main
async function main() {
  console.log('Fetching CCDC API data...\n');
  const apiData = await fetchData();
  
  console.log('\nLooking for station', STATION_ID);
  const station = findStation(apiData, STATION_ID);
  
  if (!station) {
    process.exit(1);
  }
  
  console.log('\n✓ Found station:');
  console.log(`  ID: ${station.id}`);
  console.log(`  Name: ${station.dustboy_name}`);
  console.log(`  PM2.5: ${station.pm25} μg/m³`);
  console.log(`  AQI: ${station.us_aqi} (${station.us_title_en})`);
  console.log(`  Color: ${station.us_color}`);
  console.log(`  Time: ${station.log_datetime}\n`);
  
  // Load and update history
  const history = loadHistory();
  
  history.station = {
    id: station.id,
    dustboy_id: station.dustboy_id,
    name_th: station.dustboy_name,
    name_en: station.dustboy_name_en,
    province_id: station.province_id,
    lat: station.dustboy_lat,
    lon: station.dustboy_lon
  };
  
  const reading = {
    datetime: station.log_datetime,
    pm25: station.pm25,
    pm10: station.pm10,
    us_aqi: parseInt(station.us_aqi),
    th_aqi: station.th_aqi,
    us_color: station.us_color,
    temp: station.temp,
    humid: station.humid,
    us_title: station.us_title,
    us_title_en: station.us_title_en,
    us_caption: station.us_caption,
    us_caption_en: station.us_caption_en
  };
  
  // Check duplicate
  const exists = history.readings.some(r => r.datetime === reading.datetime);
  if (exists) {
    console.log(`⚠️  Reading for ${reading.datetime} already exists, skipping`);
  } else {
    history.readings.push(reading);
    console.log(`✓ Added new reading: PM2.5 = ${reading.pm25}`);
  }
  
  // Trim to last 90 days (2160 readings)
  const MAX_READINGS = 2160;
  if (history.readings.length > MAX_READINGS) {
    history.readings = history.readings.slice(-MAX_READINGS);
    console.log(`Trimmed to last ${MAX_READINGS} readings`);
  }
  
  history.last_updated = new Date().toISOString();
  
  saveHistory(history);
  console.log(`\n✓ Saved to ${DATA_FILE}`);
  console.log(`  Total readings: ${history.readings.length}`);
  console.log(`  Last updated: ${history.last_updated}\n`);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
