#!/usr/bin/env node

/**
 * Fetches tooltip data from Google Sheets CSV and writes it to assets/tooltip-data.json
 *
 * Usage: node scripts/update-tooltip-data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0zkaovoP8dVMb1Dqbhfzno7Oprzkn03ONaYrwI6-fZKedWVcT93iXkFhwLFk4hLSNNZXHia0k3jtB/pub?gid=0&single=true&output=csv';
const OUTPUT_PATH = path.resolve(__dirname, '..', 'assets', 'tooltip-data.json');

function fetchWithRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));

    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchWithRedirects(res.headers.location, maxRedirects - 1));
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseCSV(csv) {
  const tooltips = [];
  const lines = csv.split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;

    // Parse CSV respecting quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    const [word, url, tooltip] = fields;
    if (word && url && tooltip) {
      tooltips.push({ word, url, tooltip });
    }
  }

  return tooltips;
}

async function main() {
  console.log('Fetching tooltip data from Google Sheets...');

  const csv = await fetchWithRedirects(GOOGLE_SHEET_URL);
  const tooltips = parseCSV(csv);

  console.log(`Parsed ${tooltips.length} tooltip entries`);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(tooltips, null, 2) + '\n');
  console.log(`Written to ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
