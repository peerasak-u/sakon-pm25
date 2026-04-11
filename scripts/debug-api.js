#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env
try {
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && match[2]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
} catch (e) {
  console.error('No .env file found');
  process.exit(1);
}

const API_URL = process.env.CCDC_API_URL;
const API_KEY = process.env.CCDC_API_KEY;

console.log('API_URL:', API_URL);
console.log('API_KEY exists:', !!API_KEY);

const fullUrl = API_URL + '?apikey=' + API_KEY;
console.log('\nFetching...\n');

fetch(fullUrl)
  .then(r => {
    console.log('Status:', r.status, r.statusText);
    return r.json();
  })
  .then(data => {
    console.log('\nResponse type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('\nFull response:');
    console.log(JSON.stringify(data, null, 2).substring(0, 1000));
  })
  .catch(e => console.error('Error:', e.message));
