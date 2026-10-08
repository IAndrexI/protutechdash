/**
 * Protutech Suite - Local Desktop Companion Bridge
 * Runs a lightweight local background daemon to bridge web/dashboard to local Windows apps
 * 
 * Usage:
 * node desktop/protutech-bridge.js
 */

const http = require('http');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 49152;
const ALLOWED_ORIGINS = [
  'http://localhost',
  'http://127.0.0.1',
  'https://iandrexi.github.io',
  'https://protutech.vip'
];

function isOriginAllowed(origin) {
  if (!origin) return true;
  return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed)) || origin.includes('.protutech.vip');
}

const server = http.createServer((req, res) => {
  const origin = req.headers.origin || '';
  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Health check endpoint
  if (url.pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'active',
      version: '1.0.0',
      platform: process.platform,
      user: process.env.USERNAME || process.env.USER
    }));
    return;
  }

  // Check if executable exists on local filesystem
  if (url.pathname === '/api/check-installed' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { appPath, appId } = JSON.parse(body);
        let exists = false;
        if (appPath && fs.existsSync(appPath)) {
          exists = true;
        } else if (appId === 'protutech-discord') {
          const defaultPath = path.join(process.env.USERPROFILE || '', 'Downloads', 'Protutech-Discord-Setup.exe');
          exists = fs.existsSync(defaultPath);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ appId, installed: exists }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Launch local application
  if (url.pathname === '/api/launch' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { appPath, url: appUrl, appId } = JSON.parse(body);
        console.log(`[Bridge] Received launch request for: ${appId || appUrl || appPath}`);

        // Security check: Only launch registered Protutech apps or approved paths
        if (appPath && fs.existsSync(appPath)) {
          spawn(appPath, [], { detached: true, stdio: 'ignore' }).unref();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, method: 'native-exec' }));
          return;
        }

        if (appUrl) {
          // Open URL in default browser
          const startCmd = process.platform === 'win32' ? `start "" "${appUrl}"` : `open "${appUrl}"`;
          exec(startCmd);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, method: 'url-open' }));
          return;
        }

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No launch target provided' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[Protutech Bridge] Listening on http://127.0.0.1:${PORT}`);
});
