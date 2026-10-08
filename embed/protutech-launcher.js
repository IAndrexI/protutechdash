/**
 * Protutech Suite - Universal In-App Launcher Widget
 * Author: Protutech (IAndrexI)
 * Repository: https://github.com/IAndrexI/protutechdash
 * 
 * Usage in any Protutech web app:
 * <script src="https://iandrexi.github.io/protutechdash/embed/protutech-launcher.js" data-position="top-right"></script>
 * Or locally:
 * <script src="/path/to/protutech-launcher.js"></script>
 */

(function () {
  'use strict';

  // Prevent multiple injections
  if (window.__PROTUTECH_LAUNCHER_LOADED__) return;
  window.__PROTUTECH_LAUNCHER_LOADED__ = true;

  // Default Suite Apps
  const DEFAULT_SUITE_APPS = [
    { id: 'protutech-discord', name: 'Protutech Discord', code: 'Dc', category: 'Community & Gaming', url: 'https://discopanel.protutech.vip', color: '#5865F2', installed: true, platforms: ['desktop', 'web', 'mobile'] },
    { id: 'protutech-homebox', name: 'Homebox', code: 'Hb', category: 'Productivity & Tools', url: 'https://homebox.protutech.vip', color: '#10B981', installed: true, platforms: ['web', 'mobile', 'desktop'] },
    { id: 'protutech-proxmox', name: 'Proxmox VE', code: 'Px', category: 'DevOps & Infrastructure', url: 'https://proxmox.protutech.vip', color: '#EA580C', installed: true, platforms: ['web', 'desktop'] },
    { id: 'protutech-pelican', name: 'Pelican Panel', code: 'Pl', category: 'DevOps & Infrastructure', url: 'https://pelican.protutech.vip', color: '#E11D48', installed: true, platforms: ['web', 'desktop', 'mobile'] },
    { id: 'protutech-discopanel', name: 'DiscoPanel', code: 'Dp', category: 'Community & Gaming', url: 'https://discopanel.protutech.vip', color: '#8B5CF6', installed: true, platforms: ['web', 'mobile'] },
    { id: 'protutech-seafile', name: 'Seafile Drive', code: 'Sf', category: 'Cloud & Storage', url: 'https://seafile.protutech.vip', color: '#0284C7', installed: true, platforms: ['web', 'desktop', 'mobile'] },
    { id: 'protutech-vaultwarden', name: 'Vaultwarden', code: 'Vw', category: 'Security & Identity', url: 'https://vw.protutech.vip', color: '#2563EB', installed: true, platforms: ['web', 'desktop', 'mobile'] },
    { id: 'protutech-file', name: 'Cloud Files', code: 'Fl', category: 'Cloud & Storage', url: 'https://file.protutech.vip', color: '#F59E0B', installed: true, platforms: ['web', 'mobile'] },
    { id: 'protutech-nade', name: 'Nade Tunnels', code: 'Nd', category: 'DevOps & Infrastructure', url: 'https://nade.protutech.vip', color: '#06B6D4', installed: true, platforms: ['web', 'desktop'] },
    { id: 'protutech-mail', name: 'Mail Portal', code: 'Ml', category: 'Productivity & Tools', url: 'https://mail.protutech.vip', color: '#D946EF', installed: false, platforms: ['web', 'mobile'] },
    { id: 'protutech-studio', name: 'Protutech Studio', code: 'St', category: 'Productivity & Tools', url: 'http://localhost:5173', color: '#00F2FE', installed: false, platforms: ['desktop'] }
  ];

  // Try loading customized suite from localStorage if on same origin or use default
  function getApps() {
    try {
      const stored = localStorage.getItem('protutech_apps_registry');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SUITE_APPS;
  }

  // Detect script tag configuration
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const position = (currentScript && currentScript.getAttribute('data-position')) || 'top-right';
  const customDashboardUrl = (currentScript && currentScript.getAttribute('data-dashboard-url')) || 'https://iandrexi.github.io/protutechdash/';

  // Create isolated container host
  const host = document.createElement('div');
  host.id = 'protutech-launcher-host';
  const shadow = host.attachShadow({ mode: 'open' });
  document.body.appendChild(host);

  // Inject Styles into Shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pt-trigger-btn {
      position: fixed;
      z-index: 2147483640;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #090d16, #1a2236);
      border: 1px solid rgba(0, 242, 254, 0.4);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 242, 254, 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    }

    .pt-trigger-btn:hover {
      transform: scale(1.06);
      border-color: #00f2fe;
      box-shadow: 0 6px 24px rgba(0, 242, 254, 0.4);
    }

    .pt-trigger-btn.top-right { top: 16px; right: 16px; }
    .pt-trigger-btn.top-left { top: 16px; left: 16px; }
    .pt-trigger-btn.bottom-right { bottom: 16px; right: 16px; }
    .pt-trigger-btn.bottom-left { bottom: 16px; left: 16px; }

    .pt-icon-grid {
      display: grid;
      grid-template-columns: repeat(3, 4px);
      grid-gap: 3px;
    }

    .pt-icon-dot {
      width: 4px;
      height: 4px;
      border-radius: 1px;
      background: #00f2fe;
      transition: background 0.2s;
    }

    .pt-trigger-btn:hover .pt-icon-dot {
      background: #fff;
    }

    /* Modal Backdrop */
    .pt-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(4, 7, 13, 0.65);
      backdrop-filter: blur(8px);
      z-index: 2147483641;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .pt-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }

    /* Drawer / Popover Panel */
    .pt-drawer {
      position: fixed;
      top: 16px;
      right: 16px;
      width: 380px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 32px);
      background: #0d121f;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 242, 254, 0.15);
      z-index: 2147483642;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.94) translateY(-10px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pt-drawer.active {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Header */
    .pt-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    .pt-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.3px;
    }

    .pt-brand-badge {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      background: linear-gradient(135deg, #00f2fe, #7f00ff);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: #060b14;
    }

    .pt-close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 20px;
      cursor: pointer;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .pt-close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    /* Search */
    .pt-search-box {
      padding: 12px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .pt-search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 8px 12px;
      color: #fff;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }

    .pt-search-input:focus {
      border-color: #00f2fe;
    }

    /* App Grid */
    .pt-apps-container {
      padding: 16px 20px;
      overflow-y: auto;
      max-height: 420px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .pt-app-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 12px 6px;
      border-radius: 14px;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid transparent;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .pt-app-tile:hover {
      background: rgba(255, 255, 255, 0.06);
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .pt-app-tile.disabled {
      opacity: 0.38;
      filter: grayscale(85%);
      cursor: not-allowed;
    }

    .pt-app-badge {
      width: 52px;
      height: 52px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      color: #fff;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      position: relative;
    }

    .pt-app-badge::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 13px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .pt-app-name {
      font-size: 12px;
      font-weight: 600;
      color: #e2e8f0;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .pt-status-tag {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: #94a3b8;
    }

    .pt-status-tag.not-installed {
      color: #f87171;
      background: rgba(239, 68, 68, 0.15);
    }

    /* Footer */
    .pt-footer {
      padding: 12px 20px;
      background: rgba(0, 0, 0, 0.25);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .pt-footer-link {
      color: #00f2fe;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }

    .pt-footer-link:hover {
      text-decoration: underline;
      color: #38bdf8;
    }

    .pt-suite-status {
      font-size: 11px;
      color: #64748b;
    }
  `;
  shadow.appendChild(style);

  // Trigger Button
  const trigger = document.createElement('button');
  trigger.className = `pt-trigger-btn ${position}`;
  trigger.title = 'Protutech App Suite Switcher';
  trigger.setAttribute('aria-label', 'Open Protutech Apps Switcher');
  trigger.innerHTML = `
    <div class="pt-icon-grid">
      <div class="pt-icon-dot"></div><div class="pt-icon-dot"></div><div class="pt-icon-dot"></div>
      <div class="pt-icon-dot"></div><div class="pt-icon-dot"></div><div class="pt-icon-dot"></div>
      <div class="pt-icon-dot"></div><div class="pt-icon-dot"></div><div class="pt-icon-dot"></div>
    </div>
  `;
  shadow.appendChild(trigger);

  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'pt-backdrop';
  shadow.appendChild(backdrop);

  // Drawer
  const drawer = document.createElement('div');
  drawer.className = 'pt-drawer';
  shadow.appendChild(drawer);

  function renderDrawerContent(searchTerm = '') {
    const apps = getApps();
    const filtered = apps.filter(app => {
      if (app.hidden) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return app.name.toLowerCase().includes(term) || (app.category && app.category.toLowerCase().includes(term));
    });

    drawer.innerHTML = `
      <div class="pt-header">
        <div class="pt-brand">
          <div class="pt-brand-badge">Pt</div>
          <span>Protutech Suite</span>
        </div>
        <button class="pt-close-btn" id="pt-close" title="Close Switcher">&times;</button>
      </div>

      <div class="pt-search-box">
        <input type="text" class="pt-search-input" id="pt-search" placeholder="Search Protutech apps..." value="${searchTerm}">
      </div>

      <div class="pt-apps-container">
        ${filtered.map(app => {
          const isInstalled = app.installed !== false;
          const bg = app.color || '#00f2fe';
          const href = isInstalled ? app.url : '#';
          const target = isInstalled ? '_blank' : '_self';
          const disabledClass = isInstalled ? '' : 'disabled';
          const statusHtml = isInstalled 
            ? '<span class="pt-status-tag">Ready</span>' 
            : '<span class="pt-status-tag not-installed">Not Installed</span>';

          return `
            <a href="${href}" target="${target}" class="pt-app-tile ${disabledClass}" data-app-id="${app.id}">
              <div class="pt-app-badge" style="background: ${bg};">
                ${app.code || app.name.substring(0, 2)}
              </div>
              <div class="pt-app-name">${app.name}</div>
              ${statusHtml}
            </a>
          `;
        }).join('')}
      </div>

      <div class="pt-footer">
        <span class="pt-suite-status">${filtered.length} Apps</span>
        <a href="${customDashboardUrl}" target="_blank" class="pt-footer-link">Open Full Dashboard &rarr;</a>
      </div>
    `;

    // Reattach listeners inside drawer
    shadow.getElementById('pt-close').addEventListener('click', toggleDrawer);
    const searchInput = shadow.getElementById('pt-search');
    searchInput.focus();
    searchInput.addEventListener('input', (e) => {
      renderDrawerContent(e.target.value);
    });

    // Handle clicks on disabled / not installed apps
    drawer.querySelectorAll('.pt-app-tile.disabled').forEach(tile => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        alert('This app is marked as Not Installed on this system. Open Protutech Dashboard to configure or install it.');
      });
    });
  }

  let isOpen = false;
  function toggleDrawer() {
    isOpen = !isOpen;
    if (isOpen) {
      renderDrawerContent();
      backdrop.classList.add('active');
      drawer.classList.add('active');
    } else {
      backdrop.classList.remove('active');
      drawer.classList.remove('active');
    }
  }

  trigger.addEventListener('click', toggleDrawer);
  backdrop.addEventListener('click', toggleDrawer);

  // Esc key closes drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleDrawer();
    }
  });

  // Global API exposed for programmatic control
  window.ProtutechLauncher = {
    open: () => { if (!isOpen) toggleDrawer(); },
    close: () => { if (isOpen) toggleDrawer(); },
    toggle: toggleDrawer,
    setApps: (apps) => {
      localStorage.setItem('protutech_apps_registry', JSON.stringify(apps));
      if (isOpen) renderDrawerContent();
    }
  };

  console.log('[Protutech Launcher] In-app suite switcher loaded successfully.');
})();
