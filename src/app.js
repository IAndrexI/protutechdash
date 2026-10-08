/**
 * Protutech Suite Dashboard & Cross-Platform App Launcher
 * Author: Protutech (IAndrexI)
 * Repository: https://github.com/IAndrexI/protutechdash
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEY_APPS = 'protutech_apps_registry';
  const STORAGE_KEY_THEME = 'protutech_theme_mode';
  const STORAGE_KEY_PALETTE = 'protutech_theme_palette';
  const STORAGE_KEY_PLATFORM_FILTER = 'protutech_platform_filter_mode';
  const STORAGE_KEY_SIMULATED_PLATFORM = 'protutech_simulated_platform';
  const STORAGE_KEY_VIEW_MODE = 'protutech_view_mode';
  const STORAGE_KEY_ADMIN_PIN = 'protutech_admin_pin';
  const STORAGE_KEY_DISALLOWED_SITES = 'protutech_admin_disallowed_sites';
  const STORAGE_KEY_ADMIN_PREVIEW = 'protutech_admin_preview';

  // Unified Monochrome SVG Vector Icons (Single consistent stroke & color)
  const ICONS = {
    desktop: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
    mobile: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
    web: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    pin: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    eye: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    eyeOff: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
    edit: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    moveLeft: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    moveRight: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    check: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    runner: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
    sun: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    search: `<svg class="pt-icon pt-icon-lg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    shield: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    lock: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    ban: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`,
    alert: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    info: `<svg class="pt-icon pt-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  // State
  let apps = [];
  let disallowedSites = JSON.parse(localStorage.getItem(STORAGE_KEY_DISALLOWED_SITES) || '[]');
  let adminPin = localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || 'protutech2026';
  let isAdminUnlocked = sessionStorage.getItem('protutech_admin_unlocked') === 'true';
  let adminPreviewMode = localStorage.getItem(STORAGE_KEY_ADMIN_PREVIEW) === 'true';
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let viewMode = localStorage.getItem(STORAGE_KEY_VIEW_MODE) || 'grid';
  let activeTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  let activePalette = localStorage.getItem(STORAGE_KEY_PALETTE) || 'protutech-obsidian';
  let platformFilterMode = localStorage.getItem(STORAGE_KEY_PLATFORM_FILTER) || 'grayout'; // 'grayout' | 'hide' | 'all'
  let simulatedPlatform = localStorage.getItem(STORAGE_KEY_SIMULATED_PLATFORM) || 'auto'; // 'auto' | 'desktop' | 'mobile' | 'web'
  let draggedCardId = null;
  let editingAppId = null;
  let desktopBridgeActive = false;

  // DOM Elements
  const appsGrid = document.getElementById('apps-grid');
  const searchInput = document.getElementById('search-input');
  const categoryNav = document.getElementById('category-nav');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const paletteSelect = document.getElementById('palette-select');
  const platformFilterSelect = document.getElementById('platform-filter-select');
  const platformSimulatorSelect = document.getElementById('platform-simulator-select');
  const activeDeviceBadge = document.getElementById('active-device-badge');
  const bridgeStatusEl = document.getElementById('bridge-status-indicator');

  // Modals
  const appModal = document.getElementById('app-modal');
  const embedModal = document.getElementById('embed-modal');
  const hiddenAppsModal = document.getElementById('hidden-apps-modal');
  const runnerModal = document.getElementById('runner-modal');
  const runnerIframe = document.getElementById('runner-iframe');
  const runnerTitle = document.getElementById('runner-title');

  // Counters
  const countTotalEl = document.getElementById('stat-total-apps');
  const countInstalledEl = document.getElementById('stat-installed-apps');
  const countWebEl = document.getElementById('stat-web-apps');

  // ==========================================================================
  // PLATFORM DETECTION
  // ==========================================================================
  function detectActualPlatform() {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'mobile';
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'mobile';
    if (window.innerWidth <= 768) return 'mobile';
    return 'desktop';
  }

  function getEffectivePlatform() {
    if (simulatedPlatform && simulatedPlatform !== 'auto') {
      return simulatedPlatform;
    }
    return detectActualPlatform();
  }

  function updatePlatformUI() {
    const actual = detectActualPlatform();
    const effective = getEffectivePlatform();
    if (activeDeviceBadge) {
      const icon = effective === 'mobile' ? ICONS.mobile : ICONS.desktop;
      const label = effective === 'mobile' ? 'Mobile' : 'Desktop';
      const simText = simulatedPlatform !== 'auto' ? ' (Simulated)' : '';
      activeDeviceBadge.innerHTML = `${icon} <span>${label}${simText}</span>`;
    }
  }

  // ==========================================================================
  // DESKTOP BRIDGE COMPANION CHECK
  // ==========================================================================
  async function checkDesktopBridge() {
    try {
      const res = await fetch('http://127.0.0.1:49152/api/status', { mode: 'cors' });
      if (res.ok) {
        desktopBridgeActive = true;
        if (bridgeStatusEl) {
          bridgeStatusEl.innerHTML = '<span class="status-pulse-dot" style="background:#10b981"></span> Desktop Bridge Active';
        }
      }
    } catch (e) {
      desktopBridgeActive = false;
      if (bridgeStatusEl) {
        bridgeStatusEl.innerHTML = '<span class="status-pulse-dot" style="background:#64748b; box-shadow:none;"></span> Web Mode (Standalone)';
      }
    }
  }

  // ==========================================================================
  // DATA INITIALIZATION & LOCALSTORAGE
  // ==========================================================================
  async function loadApps() {
    const local = localStorage.getItem(STORAGE_KEY_APPS);
    if (local) {
      try {
        apps = JSON.parse(local);
        render();
        return;
      } catch (e) {
        console.error('Failed to parse cached apps, falling back to default:', e);
      }
    }

    try {
      const res = await fetch('./data/default-apps.json');
      if (res.ok) {
        apps = await res.json();
        saveApps();
        render();
      }
    } catch (e) {
      console.warn('Could not fetch default-apps.json, using built-in defaults:', e);
      apps = getHardcodedDefaults();
      saveApps();
      render();
    }
  }

  function saveApps() {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
    updateStats();
  }

  function getHardcodedDefaults() {
    return [
      { id: 'protutech-discord', name: 'Protutech Discord', code: 'Dc', category: 'Community & Gaming', description: 'Custom desktop & community communication client.', url: 'https://discopanel.protutech.vip', installed: true, platforms: ['desktop', 'web', 'mobile'], color: '#5865F2', pinned: true, hidden: false, order: 0 },
      { id: 'protutech-homebox', name: 'Homebox', code: 'Hb', category: 'Productivity & Tools', description: 'Asset tracking & infrastructure inventory system.', url: 'https://homebox.protutech.vip', installed: true, platforms: ['web', 'mobile', 'desktop'], color: '#10B981', pinned: true, hidden: false, order: 1 },
      { id: 'protutech-proxmox', name: 'Proxmox VE', code: 'Px', category: 'DevOps & Infrastructure', description: 'Hypervisor, LXC containers & virtualization manager.', url: 'https://proxmox.protutech.vip', installed: true, platforms: ['web', 'desktop'], color: '#EA580C', pinned: true, hidden: false, order: 2 },
      { id: 'protutech-pelican', name: 'Pelican Panel', code: 'Pl', category: 'DevOps & Infrastructure', description: 'Game server daemon & cluster controller.', url: 'https://pelican.protutech.vip', installed: true, platforms: ['web', 'desktop', 'mobile'], color: '#E11D48', pinned: false, hidden: false, order: 3 },
      { id: 'protutech-seafile', name: 'Seafile Drive', code: 'Sf', category: 'Cloud & Storage', description: 'Encrypted cloud file synchronization.', url: 'https://seafile.protutech.vip', installed: true, platforms: ['web', 'desktop', 'mobile'], color: '#0284C7', pinned: true, hidden: false, order: 4 },
      { id: 'protutech-vaultwarden', name: 'Vaultwarden', code: 'Vw', category: 'Security & Identity', description: 'Zero-knowledge encrypted password vault.', url: 'https://vw.protutech.vip', installed: true, platforms: ['web', 'desktop', 'mobile'], color: '#2563EB', pinned: true, hidden: false, order: 5 },
      { id: 'protutech-mail', name: 'Mail Portal', code: 'Ml', category: 'Productivity & Tools', description: 'Enterprise authenticated email dispatch center.', url: 'https://mail.protutech.vip', installed: false, platforms: ['web', 'mobile'], color: '#D946EF', pinned: false, hidden: false, order: 6 },
      { id: 'protutech-studio', name: 'Protutech Studio', code: 'St', category: 'Productivity & Tools', description: 'Future desktop developer workspace cockpit.', url: 'http://localhost:5173', installed: false, platforms: ['desktop'], color: '#00F2FE', pinned: false, hidden: false, order: 7 }
    ];
  }

  // ==========================================================================
  // PROTUTECH.VIP ECOSYSTEM REGISTRY & URL DETECTOR
  // ==========================================================================
  const PROTUTECH_SERVICES_REGISTRY = {
    'homebox': {
      id: 'protutech-homebox',
      name: 'Protutech Homebox',
      code: 'Hb',
      category: 'Productivity & Tools',
      description: 'Hardware inventory, asset tracking, home infrastructure and equipment database manager.',
      color: '#10B981',
      platforms: ['web', 'mobile', 'desktop'],
      installed: true
    },
    'discopanel': {
      id: 'protutech-discopanel',
      name: 'Protutech DiscoPanel',
      code: 'Dp',
      category: 'Community & Gaming',
      description: 'Central bot operations center, automation triggers, webhook pipelines, and server controls.',
      color: '#8B5CF6',
      platforms: ['web', 'mobile'],
      installed: true
    },
    'proxmox': {
      id: 'protutech-proxmox',
      name: 'Protutech Proxmox VE',
      code: 'Px',
      category: 'DevOps & Infrastructure',
      description: 'Virtualization hypervisor, LXC container orchestration, cluster monitoring, and VM remote console.',
      color: '#EA580C',
      platforms: ['web', 'desktop'],
      installed: true
    },
    'pelican': {
      id: 'protutech-pelican',
      name: 'Protutech Pelican Panel',
      code: 'Pl',
      category: 'DevOps & Infrastructure',
      description: 'Next-generation game server daemon and node controller panel with real-time resource diagnostics.',
      color: '#E11D48',
      platforms: ['web', 'desktop', 'mobile'],
      installed: true
    },
    'seafile': {
      id: 'protutech-seafile',
      name: 'Protutech Seafile Drive',
      code: 'Sf',
      category: 'Cloud & Storage',
      description: 'Encrypted enterprise cloud file synchronization, shared libraries, and high-speed multi-gigabit storage.',
      color: '#0284C7',
      platforms: ['web', 'desktop', 'mobile'],
      installed: true
    },
    'vw': {
      id: 'protutech-vaultwarden',
      name: 'Protutech Vaultwarden',
      code: 'Vw',
      category: 'Security & Identity',
      description: 'Zero-knowledge end-to-end encrypted password vault, API key manager, and 2FA credential sync.',
      color: '#2563EB',
      platforms: ['web', 'desktop', 'mobile'],
      installed: true
    },
    'file': {
      id: 'protutech-file',
      name: 'Protutech Direct Files',
      code: 'Fl',
      category: 'Cloud & Storage',
      description: 'High-throughput direct file gateway, public drop-zones, and fast streaming media repository.',
      color: '#F59E0B',
      platforms: ['web', 'mobile'],
      installed: true
    },
    'nade': {
      id: 'protutech-nade',
      name: 'Protutech Nade Tunnels',
      code: 'Nd',
      category: 'DevOps & Infrastructure',
      description: 'Edge routing nodes, Cloudflare Argo tunnel monitor, and internal network gateways.',
      color: '#06B6D4',
      platforms: ['web', 'desktop'],
      installed: true
    },
    'mail': {
      id: 'protutech-mail',
      name: 'Protutech Mail Portal',
      code: 'Ml',
      category: 'Productivity & Tools',
      description: 'Enterprise Brevo authenticated email gateway, domain routing, and newsletter dispatch center.',
      color: '#D946EF',
      platforms: ['web', 'mobile'],
      installed: false
    },
    'email': {
      id: 'protutech-mail',
      name: 'Protutech Mail Portal',
      code: 'Ml',
      category: 'Productivity & Tools',
      description: 'Enterprise Brevo authenticated email gateway, domain routing, and newsletter dispatch center.',
      color: '#D946EF',
      platforms: ['web', 'mobile'],
      installed: false
    },
    'sl': {
      id: 'protutech-sl',
      name: 'Protutech SimpleLogin',
      code: 'Sl',
      category: 'Security & Identity',
      description: 'Private email alias gateway and identity cloak routing for secure correspondence.',
      color: '#3B82F6',
      platforms: ['web', 'mobile'],
      installed: true
    }
  };

  /**
   * Checks if an app, domain, or subdomain is on the admin disallowed list
   */
  function isWebsiteDisallowed(app) {
    if (!app) return false;
    if (app.id && disallowedSites.includes(app.id)) return true;
    if (app.url) {
      try {
        let u = app.url;
        if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
        const host = new URL(u).hostname.toLowerCase();
        if (disallowedSites.includes(host)) return true;
        const sub = host.replace('.protutech.vip', '');
        if (disallowedSites.includes(sub)) return true;
      } catch (e) {}
    }
    return false;
  }

  /**
   * Strictly validates that the URL belongs to protutech.vip domain
   * and parses/derives app metadata.
   */
  function validateAndParseProtutechUrl(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') {
      return { valid: false, error: 'Please enter a valid URL.' };
    }

    let input = rawInput.trim();
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      input = 'https://' + input;
    }

    let urlObj;
    try {
      urlObj = new URL(input);
    } catch (e) {
      return { valid: false, error: 'Invalid URL format.' };
    }

    const host = urlObj.hostname.toLowerCase();

    // STRICT CHECK: ONLY protutech.vip or its subdomains (*.protutech.vip)
    if (host !== 'protutech.vip' && !host.endsWith('.protutech.vip')) {
      return {
        valid: false,
        error: `Domain "${host}" rejected. Only services on the "protutech.vip" domain are permitted.`
      };
    }

    // Extract subdomain
    let subdomain = '';
    if (host.endsWith('.protutech.vip')) {
      subdomain = host.replace('.protutech.vip', '').split('.').pop();
    } else {
      subdomain = 'main';
    }

    // ADMIN DISALLOW POLICY CHECK
    if (isWebsiteDisallowed({ url: `https://${host}`, id: `protutech-${subdomain}` })) {
      return {
        valid: false,
        error: `Website "${host}" has been restricted by an administrator policy and cannot be shown in the launcher list.`
      };
    }

    // Check if in known registry
    if (PROTUTECH_SERVICES_REGISTRY[subdomain]) {
      const known = PROTUTECH_SERVICES_REGISTRY[subdomain];
      return {
        valid: true,
        subdomain,
        canonicalUrl: `https://${host}`,
        app: {
          ...known,
          url: `https://${host}`,
          protocol: `https://${host}`
        }
      };
    }

    // Dynamic derivation for future apps on *.protutech.vip
    const formattedTitle = 'Protutech ' + subdomain.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const code = subdomain.substring(0, 2).toUpperCase();
    
    // Aesthetic color generation from name hash
    const colors = ['#00F2FE', '#38BDF8', '#818CF8', '#A855F7', '#EC4899', '#10B981', '#F59E0B', '#06B6D4'];
    let hash = 0;
    for (let i = 0; i < subdomain.length; i++) hash = subdomain.charCodeAt(i) + ((hash << 5) - hash);
    const chosenColor = colors[Math.abs(hash) % colors.length];

    return {
      valid: true,
      subdomain,
      canonicalUrl: `https://${host}`,
      app: {
        id: `protutech-${subdomain}`,
        name: formattedTitle,
        code: code,
        category: 'Productivity & Tools',
        description: `Dedicated ${formattedTitle} application hosted on ${host}.`,
        url: `https://${host}`,
        protocol: `https://${host}`,
        desktopPath: '',
        color: chosenColor,
        platforms: ['web', 'mobile', 'desktop'],
        installed: true,
        pinned: false,
        hidden: false
      }
    };
  }

  /**
   * Adds or focuses an app based on a typed protutech.vip URL
   */
  function addOrFocusAppFromUrl(rawUrl) {
    const parseResult = validateAndParseProtutechUrl(rawUrl);
    if (!parseResult.valid) {
      alert(`[Domain Restriction Error]\n\n${parseResult.error}`);
      showToast(parseResult.error, 'error');
      return false;
    }

    const detectedApp = parseResult.app;
    const existing = apps.find(a => 
      (a.url && a.url.toLowerCase() === detectedApp.url.toLowerCase()) || 
      a.id === detectedApp.id
    );

    if (existing) {
      // Unhide if was hidden
      existing.hidden = false;
      saveApps();
      render();

      // Smooth scroll and flash highlight
      setTimeout(() => {
        const card = document.querySelector(`.app-card[data-id="${existing.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('card-flash-highlight');
          setTimeout(() => card.classList.remove('card-flash-highlight'), 1600);
        }
      }, 100);

      showToast(`Focused existing app: "${existing.name}"`);
      return true;
    }

    // New app: append to apps
    detectedApp.order = apps.length;
    apps.push(detectedApp);
    saveApps();
    render();

    // Scroll and flash highlight
    setTimeout(() => {
      const card = document.querySelector(`.app-card[data-id="${detectedApp.id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('card-flash-highlight');
        setTimeout(() => card.classList.remove('card-flash-highlight'), 1600);
      }
    }, 100);

    showToast(`Added "${detectedApp.name}" (${parseResult.subdomain}.protutech.vip) to suite`);
    return true;
  }

  // ==========================================================================
  // LAUNCH SECURITY & EXECUTION
  // ==========================================================================
  function isApprovedApp(app) {
    if (!app || !app.url) return false;
    // Allow protutech domains, local dev hosts, custom protocols
    const url = app.url.toLowerCase();
    return url.includes('protutech.vip') ||
           url.startsWith('http://localhost') ||
           url.startsWith('http://127.0.0.1') ||
           url.startsWith('protutech://') ||
           url.startsWith('discord://') ||
           url.startsWith('seafile://') ||
           url.startsWith('bitwarden://') ||
           url.startsWith('https://');
  }

  async function launchApp(app, inAppRunner = false) {
    if (!isApprovedApp(app)) {
      alert(`[Security Alert] Launch target for "${app.name}" is not an approved Protutech endpoint.`);
      return;
    }

    if (!app.installed) {
      if (confirm(`"${app.name}" is marked as NOT INSTALLED on this device.\n\nWould you like to open the installation/setup guide now?`)) {
        window.open(app.installUrl || app.url, '_blank');
      }
      return;
    }

    // Check platform compatibility
    const currentPlatform = getEffectivePlatform();
    const isSupported = (app.platforms || []).includes(currentPlatform) || (app.platforms || []).includes('web');
    if (!isSupported) {
      alert(`[Compatibility Notice] "${app.name}" is designed for ${app.platforms.join(', ')} and may not operate properly on ${currentPlatform}.`);
    }

    // Bridge execution if desktop executable configured & bridge active
    if (desktopBridgeActive && app.desktopPath) {
      try {
        const res = await fetch('http://127.0.0.1:49152/api/launch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId: app.id, appPath: app.desktopPath, url: app.url })
        });
        if (res.ok) {
          showToast(`Launched ${app.name} via Local Desktop Bridge`);
          return;
        }
      } catch (e) {
        console.warn('Bridge launch failed, falling back to browser:', e);
      }
    }

    // In-App Web Runner mode
    if (inAppRunner && app.url && app.url.startsWith('http')) {
      openInAppRunner(app);
      return;
    }

    // Default: Open in clean external window
    window.open(app.url, '_blank', 'noopener,noreferrer');
    showToast(`Opening ${app.name}...`);
  }

  function openInAppRunner(app) {
    if (!runnerModal || !runnerIframe) return;
    runnerTitle.textContent = `Protutech Suite - ${app.name}`;
    runnerIframe.src = app.url;
    runnerModal.classList.add('active');
  }

  function closeInAppRunner() {
    if (!runnerModal || !runnerIframe) return;
    runnerIframe.src = 'about:blank';
    runnerModal.classList.remove('active');
  }

  // ==========================================================================
  // RENDERING ENGINE
  // ==========================================================================
  function render() {
    if (!appsGrid) return;
    updatePlatformUI();

    const titleEl = document.getElementById('current-view-title');
    if (titleEl) {
      if (viewMode === 'periodic') {
        titleEl.textContent = 'Periodic Table of Applications';
      } else if (currentCategory === 'all') {
        titleEl.textContent = 'All Applications';
      } else if (currentCategory === 'favorites') {
        titleEl.textContent = 'Favorites & Pinned';
      } else if (currentCategory === 'installed') {
        titleEl.textContent = 'Installed on System';
      } else {
        titleEl.textContent = currentCategory;
      }
    }

    const effectivePlatform = getEffectivePlatform();
    const query = currentSearchQuery.trim().toLowerCase();

    // Filter & Sort
    let visibleApps = apps.filter(app => {
      // Admin Disallow Policy filter
      const isBlocked = isWebsiteDisallowed(app);
      if (isBlocked && (!isAdminUnlocked || !adminPreviewMode)) {
        return false;
      }

      // Hidden filter
      if (app.hidden) return false;

      // Category filter
      if (currentCategory === 'installed' && !app.installed) return false;
      if (currentCategory === 'favorites' && !app.pinned) return false;
      if (currentCategory !== 'all' && currentCategory !== 'installed' && currentCategory !== 'favorites' && app.category !== currentCategory) {
        return false;
      }

      // Platform filter: if mode is 'hide', exclude incompatible apps completely
      if (platformFilterMode === 'hide') {
        const supported = (app.platforms || []).includes(effectivePlatform) || (app.platforms || []).includes('web');
        if (!supported) return false;
      }

      // Search query
      if (query) {
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesCategory = (app.category || '').toLowerCase().includes(query);
        const matchesDesc = (app.description || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      return true;
    });

    // Pinned apps stay first, then by order
    visibleApps.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (a.order || 0) - (b.order || 0);
    });

    // Sync view pills
    document.querySelectorAll('.view-pill').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === viewMode);
    });

    // Apply view mode classes
    appsGrid.className = `apps-grid ${viewMode === 'list' ? 'list-view' : (viewMode === 'compact' ? 'compact' : (viewMode === 'periodic' ? 'periodic-view' : ''))}`;

    if (visibleApps.length === 0) {
      appsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <div style="margin-bottom: 12px; display: flex; justify-content: center; color: var(--text-dim);">${ICONS.search}</div>
          <h3 style="font-size: 18px; color: var(--text-muted); margin-bottom: 8px;">No Apps Found</h3>
          <p style="font-size: 13.5px;">No applications match the current filter or search criteria.</p>
          <button class="header-btn primary" style="margin-top: 16px;" onclick="window.ProtutechDash.resetFilters()">Reset All Filters</button>
        </div>
      `;
      updateStats();
      return;
    }

    // Branch to Periodic Table View if active
    if (viewMode === 'periodic') {
      renderPeriodicTableView(visibleApps);
      updateStats();
      return;
    }

    // Render Cards
    appsGrid.innerHTML = visibleApps.map((app, index) => {
      const isInstalled = app.installed !== false;
      const isPlatformCompatible = (app.platforms || []).includes(effectivePlatform) || (app.platforms || []).includes('web');
      const isBlocked = isWebsiteDisallowed(app);
      
      // Determine Grayed-Out / Incompatible status
      const cardClasses = [
        'app-card',
        isInstalled ? 'installed' : 'not-installed',
        isPlatformCompatible ? '' : 'incompatible-platform',
        isBlocked ? 'admin-blocked' : '',
        app.pinned ? 'is-pinned' : ''
      ].filter(Boolean).join(' ');

      // Adobe style badge gradient
      const badgeBg = app.color || '#00f2fe';
      const initials = app.code || (app.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase());

      // Platform Badges
      const platformTagsHtml = (app.platforms || []).map(p => {
        const icon = p === 'desktop' ? ICONS.desktop : (p === 'mobile' ? ICONS.mobile : ICONS.web);
        return `<span class="platform-tag">${icon} ${p}</span>`;
      }).join('');

      // Status Badge
      let statusBadgeHtml = '';
      if (isBlocked) {
        statusBadgeHtml = `<span class="status-badge not-installed" style="color:var(--text-muted); border-color:var(--border-subtle); display: inline-flex; align-items: center; gap: 4px;">${ICONS.ban} Disallowed</span>`;
      } else if (!isInstalled) {
        statusBadgeHtml = '<span class="status-badge not-installed">Not Installed</span>';
      } else if (!isPlatformCompatible) {
        statusBadgeHtml = `<span class="status-badge incompatible" style="display: inline-flex; align-items: center; gap: 4px;">${ICONS.alert} ${effectivePlatform === 'mobile' ? 'Desktop' : 'Mobile'} Only</span>`;
      } else {
        statusBadgeHtml = '<span class="status-badge installed">Ready</span>';
      }

      // Action Button (Launch or Install)
      let actionBtnHtml = '';
      if (isInstalled) {
        actionBtnHtml = `
          <button class="btn-launch" onclick="window.ProtutechDash.launch('${app.id}')" title="Launch ${app.name}">
            <span>Launch</span> &rarr;
          </button>
          <button class="btn-more-options" onclick="window.ProtutechDash.launchInApp('${app.id}')" title="Open inside Protutech runner window">
            ${ICONS.runner}
          </button>
        `;
      } else {
        actionBtnHtml = `
          <button class="btn-install" onclick="window.ProtutechDash.install('${app.id}')" title="Install or Setup ${app.name}">
            <span>Install / Setup</span>
          </button>
          <button class="btn-more-options" onclick="window.ProtutechDash.toggleInstalled('${app.id}')" title="Mark as Installed on this machine">
            ${ICONS.check}
          </button>
        `;
      }

      return `
        <div class="${cardClasses}" 
             data-id="${app.id}" 
             data-index="${index}"
             draggable="true">
          
          <div class="card-top-bar">
            <!-- Adobe-Style 2-Letter Logo Badge -->
            <div class="adobe-app-badge" style="background: ${badgeBg};" title="${app.name} (${initials})">
              ${initials}
            </div>

            <!-- Quick Actions: Pin, Hide, Edit, Move Up/Down -->
            <div class="card-actions-quick">
              <button class="quick-icon-btn ${app.pinned ? 'pinned' : ''}" 
                      onclick="window.ProtutechDash.togglePin('${app.id}')" 
                      title="${app.pinned ? 'Unpin from Top' : 'Pin to Top'}">
                ${ICONS.pin}
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.toggleHide('${app.id}')" 
                      title="Hide App">
                ${ICONS.eyeOff}
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.editApp('${app.id}')" 
                      title="Edit App Details">
                ${ICONS.edit}
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.moveOrder('${app.id}', -1)" 
                      title="Move Left/Up">
                ${ICONS.moveLeft}
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.moveOrder('${app.id}', 1)" 
                      title="Move Right/Down">
                ${ICONS.moveRight}
              </button>
            </div>
          </div>

          <div class="card-content">
            <div class="app-title-row">
              <h3 class="app-title">${app.name}</h3>
            </div>
            <div class="app-category-badge">${app.category || 'Protutech Suite'}</div>
            <p class="app-description">${app.description || 'Protutech Application'}</p>

            <div class="card-tags">
              ${statusBadgeHtml}
              ${platformTagsHtml}
            </div>
          </div>

          <div class="card-footer">
            ${actionBtnHtml}
          </div>
        </div>
      `;
    }).join('');

    attachDragAndDropListeners();
    updateStats();
  }

  // ==========================================================================
  // PERIODIC TABLE OF PROTUTECH APPS ENGINE
  // ==========================================================================
  let activePeriodicSeries = 'all';

  function setPeriodicSeriesFilter(seriesId) {
    activePeriodicSeries = seriesId;
    render();
  }

  function renderPeriodicTableView(visibleApps) {
    // Defined Periodic Blocks / Series
    const PERIODIC_SECTIONS = [
      {
        id: 'devops',
        category: 'DevOps & Infrastructure',
        roman: 'Block I',
        title: 'DevOps & Core Infrastructure',
        color: '#EA580C',
        desc: 'Virtualization, hypervisors, container nodes & network tunnels'
      },
      {
        id: 'cloud',
        category: 'Cloud & Storage',
        roman: 'Block II',
        title: 'Cloud Files & Persistent Storage',
        color: '#0284C7',
        desc: 'Encrypted drive libraries, object storage & multi-gigabit sync'
      },
      {
        id: 'security',
        category: 'Security & Identity',
        roman: 'Block III',
        title: 'Security, Vaults & Identity',
        color: '#2563EB',
        desc: 'Zero-knowledge credential vaults, alias gateways & 2FA'
      },
      {
        id: 'gaming',
        category: 'Community & Gaming',
        roman: 'Block IV',
        title: 'Community, Bots & Gaming',
        color: '#8B5CF6',
        desc: 'Voice clients, bot infrastructure & webhook event hubs'
      },
      {
        id: 'productivity',
        category: 'Productivity & Tools',
        roman: 'Block V',
        title: 'Productivity & System Utilities',
        color: '#10B981',
        desc: 'Asset databases, mail hubs, developer studios & local bridges'
      }
    ];

    // Catch any custom or user-added categories
    const knownCategories = PERIODIC_SECTIONS.map(s => s.category);
    const extraCategories = [...new Set(visibleApps.map(a => a.category).filter(c => c && !knownCategories.includes(c)))];
    
    const allSections = [...PERIODIC_SECTIONS];
    extraCategories.forEach((extraCat, idx) => {
      allSections.push({
        id: `custom-${idx}`,
        category: extraCat,
        roman: `Block ${['VI', 'VII', 'VIII', 'IX', 'X'][idx] || 'Custom'}`,
        title: extraCat,
        color: '#00F2FE',
        desc: 'Custom extensions & user-registered elemental applications'
      });
    });

    const totalElements = visibleApps.length;

    // Filter by series if activePeriodicSeries !== 'all'
    const sectionsToRender = activePeriodicSeries === 'all' 
      ? allSections 
      : allSections.filter(s => s.id === activePeriodicSeries || s.category === activePeriodicSeries);

    // Build Legend Pills
    const legendPillsHtml = [
      `<button class="periodic-legend-pill ${activePeriodicSeries === 'all' ? 'active' : ''}" onclick="window.ProtutechDash.setPeriodicSeriesFilter('all')">
        <span class="periodic-legend-dot" style="background: var(--accent-primary);"></span>
        <span>All Series (${totalElements})</span>
      </button>`
    ].concat(
      allSections.map(s => {
        const count = visibleApps.filter(a => a.category === s.category).length;
        if (count === 0 && activePeriodicSeries !== s.id) return '';
        return `
          <button class="periodic-legend-pill ${activePeriodicSeries === s.id ? 'active' : ''}" onclick="window.ProtutechDash.setPeriodicSeriesFilter('${s.id}')">
            <span class="periodic-legend-dot" style="background: ${s.color};"></span>
            <span>${s.category} (${count})</span>
          </button>
        `;
      }).filter(Boolean)
    ).join('');

    // Build Sections
    let sectionsHtml = '';
    let globalAtomicNumber = 1;

    sectionsToRender.forEach(sec => {
      const sectionApps = visibleApps.filter(a => a.category === sec.category);
      if (sectionApps.length === 0) return;

      const elementsHtml = sectionApps.map((app) => {
        const atomicNum = (app.order !== undefined ? app.order + 1 : globalAtomicNumber++);
        const isInstalled = app.installed !== false;
        const isBlocked = isWebsiteDisallowed(app);
        const accent = app.color || sec.color || '#00f2fe';
        const symbol = app.code || (app.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase());
        
        // Derive atomic weight / port
        let atomicWeight = '443';
        if (app.url) {
          try {
            const parsed = new URL(app.url);
            atomicWeight = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
          } catch(e) {
            atomicWeight = 'v1.0';
          }
        }

        // Subdomain or host
        let hostDisplay = 'protutech.vip';
        if (app.url) {
          try {
            hostDisplay = new URL(app.url).hostname;
          } catch(e) {
            hostDisplay = app.url;
          }
        }

        const classes = [
          'periodic-element',
          isInstalled ? 'installed' : 'not-installed',
          isBlocked ? 'admin-blocked' : '',
          app.pinned ? 'is-pinned' : ''
        ].filter(Boolean).join(' ');

        return `
          <div class="${classes}" 
               style="--element-accent: ${accent};"
               onclick="window.ProtutechDash.inspectElement('${app.id}')"
               title="Element #${atomicNum}: ${app.name} (${symbol}) - Click to inspect or launch">
            
            <div class="periodic-element-top">
              <span class="periodic-atomic-num">${atomicNum}</span>
              <span class="periodic-atomic-mass">${atomicWeight}</span>
            </div>

            <div class="periodic-element-symbol">${symbol}</div>

            <div class="periodic-element-bottom">
              <div class="periodic-element-name">${app.name}</div>
              <div class="periodic-element-sub">${hostDisplay}</div>
            </div>

            <div class="periodic-quick-hover">
              <button class="periodic-quick-hover-btn" onclick="event.stopPropagation(); window.ProtutechDash.launch('${app.id}')">
                <span>Launch</span> &rarr;
              </button>
              <span style="font-size: 9.5px; color: var(--text-muted);">Inspect Details</span>
            </div>
          </div>
        `;
      }).join('');

      sectionsHtml += `
        <div class="periodic-section-block">
          <div class="periodic-section-header">
            <div class="periodic-section-title-wrap">
              <div class="periodic-section-accent-bar" style="background: ${sec.color}; box-shadow: 0 0 10px ${sec.color};"></div>
              <div>
                <div class="periodic-section-title">${sec.roman} • ${sec.title}</div>
                <div style="font-size: 11px; color: var(--text-dim);">${sec.desc}</div>
              </div>
            </div>
            <div class="periodic-section-badge" style="border-color: ${sec.color}40;">
              ${sectionApps.length} ${sectionApps.length === 1 ? 'Element' : 'Elements'}
            </div>
          </div>
          <div class="periodic-elements-grid">
            ${elementsHtml}
          </div>
        </div>
      `;
    });

    appsGrid.innerHTML = `
      <div class="periodic-container">
        <div class="periodic-header-box">
          <div class="periodic-header-top">
            <div class="periodic-title-group">
              <svg class="pt-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
              <div>
                <div class="periodic-title">Periodic Table of Protutech Applications</div>
                <div class="periodic-subtitle">Interactive elemental suite classification arranged into functional system blocks.</div>
              </div>
            </div>
            <button class="header-btn" onclick="window.ProtutechDash.setPeriodicSeriesFilter('all')" style="font-size: 11.5px; padding: 4px 10px;">
              Reset Block Filter
            </button>
          </div>
          <div class="periodic-legend">
            ${legendPillsHtml}
          </div>
        </div>
        ${sectionsHtml || '<div style="text-align: center; padding: 40px; color: var(--text-dim);">No elements match the selected filter.</div>'}
      </div>
    `;
  }

  function inspectElement(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    const modal = document.getElementById('periodic-inspector-modal');
    const body = document.getElementById('inspector-modal-body');
    const footer = document.getElementById('inspector-modal-footer');
    const title = document.getElementById('inspector-element-title');
    if (!modal || !body || !footer) return;

    const isInstalled = app.installed !== false;
    const isBlocked = isWebsiteDisallowed(app);
    const accent = app.color || '#00f2fe';
    const symbol = app.code || (app.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase());
    const atomicNum = app.order !== undefined ? app.order + 1 : 1;

    let atomicWeight = '443';
    if (app.url) {
      try {
        const parsed = new URL(app.url);
        atomicWeight = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
      } catch(e) {
        atomicWeight = 'v1.0';
      }
    }

    if (title) {
      title.textContent = `Elemental Profile: ${app.name} (${symbol})`;
    }

    body.innerHTML = `
      <div class="inspector-hero-card">
        <div class="inspector-element-box" style="--element-accent: ${accent};">
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-dim); font-family: monospace;">
            <span style="font-weight: 800; color: var(--text-muted);">${atomicNum}</span>
            <span>${atomicWeight}</span>
          </div>
          <div style="font-size: 32px; font-weight: 900; color: ${accent}; text-align: center; line-height: 1;">${symbol}</div>
          <div style="font-size: 10px; font-weight: 700; color: var(--text-main); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${app.name}</div>
        </div>
        <div>
          <div style="font-size: 19px; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">${app.name}</div>
          <div style="font-size: 12.5px; color: ${accent}; font-weight: 700; margin-bottom: 8px;">${app.category || 'Protutech Suite'}</div>
          <p style="font-size: 12.5px; color: var(--text-muted); line-height: 1.5; margin: 0;">${app.description || 'Protutech ecosystem elemental application.'}</p>
        </div>
      </div>

      <div class="inspector-meta-grid">
        <div class="inspector-meta-item">
          <div class="inspector-meta-label">Atomic Number / Order</div>
          <div class="inspector-meta-value">Element #${atomicNum} in Suite</div>
        </div>
        <div class="inspector-meta-item">
          <div class="inspector-meta-label">Classification Block</div>
          <div class="inspector-meta-value">${app.category || 'Standard'}</div>
        </div>
        <div class="inspector-meta-item">
          <div class="inspector-meta-label">Resonance URL</div>
          <div class="inspector-meta-value" style="color: var(--accent-primary); font-family: monospace; font-size: 12px;">${app.url || 'None'}</div>
        </div>
        <div class="inspector-meta-item">
          <div class="inspector-meta-label">Bond Status (System)</div>
          <div class="inspector-meta-value">
            ${isBlocked ? '<span style="color: #f87171;">Disallowed by Admin</span>' : (isInstalled ? '<span style="color: var(--color-success);">Ready / Installed</span>' : '<span style="color: var(--color-warning);">Unbonded / Not Installed</span>')}
          </div>
        </div>
        <div class="inspector-meta-item">
          <div class="inspector-meta-label">Valence Shells (Platforms)</div>
          <div class="inspector-meta-value">${(app.platforms || ['web']).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' • ')}</div>
        </div>
        <div class="inspector-meta-item">
          <div class="inspector-meta-label">Priority Pinning</div>
          <div class="inspector-meta-value">${app.pinned ? 'Pinned to Top' : 'Standard Priority'}</div>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button type="button" class="header-btn" onclick="document.getElementById('periodic-inspector-modal').classList.remove('active'); window.ProtutechDash.editApp('${app.id}')" style="margin-right: auto;">
        ${ICONS.edit} <span>Edit App</span>
      </button>
      <button type="button" class="header-btn" onclick="window.ProtutechDash.togglePin('${app.id}'); window.ProtutechDash.inspectElement('${app.id}')">
        ${ICONS.pin} <span>${app.pinned ? 'Unpin' : 'Pin'}</span>
      </button>
      <button type="button" class="header-btn" onclick="window.ProtutechDash.toggleInstalled('${app.id}'); window.ProtutechDash.inspectElement('${app.id}')">
        ${ICONS.check} <span>${isInstalled ? 'Mark Uninstalled' : 'Mark Installed'}</span>
      </button>
      <button type="button" class="header-btn primary" onclick="document.getElementById('periodic-inspector-modal').classList.remove('active'); window.ProtutechDash.launch('${app.id}')">
        <span>Launch App</span> &rarr;
      </button>
    `;

    modal.classList.add('active');
  }

  function updateStats() {
    const activeApps = apps.filter(a => !isWebsiteDisallowed(a));
    const total = activeApps.filter(a => !a.hidden).length;
    const installed = activeApps.filter(a => !a.hidden && a.installed !== false).length;
    const web = activeApps.filter(a => !a.hidden && (a.platforms || []).includes('web')).length;

    if (countTotalEl) countTotalEl.textContent = total;
    if (countInstalledEl) countInstalledEl.textContent = installed;
    if (countWebEl) countWebEl.textContent = web;

    // Update nav item counts
    document.querySelectorAll('.nav-item[data-cat]').forEach(el => {
      const cat = el.getAttribute('data-cat');
      const badge = el.querySelector('.badge-count');
      if (badge) {
        if (cat === 'all') badge.textContent = total;
        else if (cat === 'installed') badge.textContent = installed;
        else if (cat === 'favorites') badge.textContent = activeApps.filter(a => !a.hidden && a.pinned).length;
        else badge.textContent = activeApps.filter(a => !a.hidden && a.category === cat).length;
      }
    });

    // Update admin blocked count in sidebar
    const adminBlockedEl = document.getElementById('admin-blocked-count');
    if (adminBlockedEl) {
      adminBlockedEl.textContent = disallowedSites.length;
    }

    // Update chip visibility in URL detector
    document.querySelectorAll('.protutech-chip').forEach(chip => {
      const chipSub = chip.textContent.trim().toLowerCase();
      const chipHost = `${chipSub}.protutech.vip`;
      const isChipBlocked = disallowedSites.includes(chipSub) || disallowedSites.includes(chipHost) || disallowedSites.includes(`protutech-${chipSub}`);
      chip.style.display = isChipBlocked ? 'none' : 'inline-flex';
    });

    // Update header admin button state
    const adminHeaderIcon = document.getElementById('header-admin-icon');
    const adminHeaderText = document.getElementById('header-admin-text');
    if (adminHeaderIcon && adminHeaderText) {
      if (isAdminUnlocked) {
        adminHeaderIcon.innerHTML = ICONS.shield;
        adminHeaderText.textContent = 'Admin (Unlocked)';
      } else {
        adminHeaderIcon.innerHTML = ICONS.lock;
        adminHeaderText.textContent = 'Admin';
      }
    }
  }

  // ==========================================================================
  // DRAG & DROP REORDERING ENGINE
  // ==========================================================================
  function attachDragAndDropListeners() {
    const cards = appsGrid.querySelectorAll('.app-card');

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        draggedCardId = card.getAttribute('data-id');
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedCardId);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        cards.forEach(c => c.classList.remove('drag-over'));
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const targetId = card.getAttribute('data-id');
        if (targetId !== draggedCardId) {
          card.classList.add('drag-over');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const targetId = card.getAttribute('data-id');
        if (draggedCardId && targetId && draggedCardId !== targetId) {
          reorderApps(draggedCardId, targetId);
        }
      });
    });
  }

  function reorderApps(sourceId, targetId) {
    const sourceIdx = apps.findIndex(a => a.id === sourceId);
    const targetIdx = apps.findIndex(a => a.id === targetId);
    if (sourceIdx < 0 || targetIdx < 0) return;

    const [moved] = apps.splice(sourceIdx, 1);
    apps.splice(targetIdx, 0, moved);

    // Re-index orders
    apps.forEach((a, i) => { a.order = i; });
    saveApps();
    render();
    showToast(`Reordered "${moved.name}"`);
  }

  function moveOrder(appId, delta) {
    const idx = apps.findIndex(a => a.id === appId);
    if (idx < 0) return;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= apps.length) return;

    const temp = apps[idx];
    apps[idx] = apps[targetIdx];
    apps[targetIdx] = temp;

    apps.forEach((a, i) => { a.order = i; });
    saveApps();
    render();
  }

  // ==========================================================================
  // APP ACTIONS: PIN, HIDE, INSTALL TOGGLE
  // ==========================================================================
  function togglePin(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    app.pinned = !app.pinned;
    saveApps();
    render();
    showToast(app.pinned ? `Pinned ${app.name} to top` : `Unpinned ${app.name}`);
  }

  function toggleHide(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    app.hidden = true;
    saveApps();
    render();
    showToast(`Hidden ${app.name}. Restore anytime from "Hidden Apps".`);
  }

  function toggleInstalled(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    app.installed = !app.installed;
    saveApps();
    render();
    showToast(app.installed ? `Marked ${app.name} as Installed` : `Marked ${app.name} as Not Installed`);
  }

  // ==========================================================================
  // ADD & EDIT FUTURE APPS (APP MANAGER MODAL)
  // ==========================================================================
  function openAddAppModal() {
    editingAppId = null;
    document.getElementById('modal-app-title').textContent = 'Register New Protutech App';
    document.getElementById('form-app-id').value = '';
    document.getElementById('form-app-name').value = '';
    document.getElementById('form-app-code').value = '';
    document.getElementById('form-app-category').value = 'Productivity & Tools';
    document.getElementById('form-app-url').value = '';
    document.getElementById('form-app-protocol').value = '';
    document.getElementById('form-app-desktop-path').value = '';
    document.getElementById('form-app-install-url').value = '';
    document.getElementById('form-app-desc').value = '';
    document.getElementById('form-app-color').value = '#00F2FE';
    document.getElementById('form-app-installed').checked = true;
    document.getElementById('form-platform-desktop').checked = true;
    document.getElementById('form-platform-web').checked = true;
    document.getElementById('form-platform-mobile').checked = true;
    updateBadgeLivePreview();
    appModal.classList.add('active');
  }

  function editApp(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    editingAppId = appId;
    document.getElementById('modal-app-title').textContent = `Edit App - ${app.name}`;
    document.getElementById('form-app-id').value = app.id;
    document.getElementById('form-app-name').value = app.name;
    document.getElementById('form-app-code').value = app.code || '';
    document.getElementById('form-app-category').value = app.category || 'Productivity & Tools';
    document.getElementById('form-app-url').value = app.url || '';
    document.getElementById('form-app-protocol').value = app.protocol || '';
    document.getElementById('form-app-desktop-path').value = app.desktopPath || '';
    document.getElementById('form-app-install-url').value = app.installUrl || '';
    document.getElementById('form-app-desc').value = app.description || '';
    document.getElementById('form-app-color').value = app.color || '#00F2FE';
    document.getElementById('form-app-installed').checked = app.installed !== false;

    const platforms = app.platforms || [];
    document.getElementById('form-platform-desktop').checked = platforms.includes('desktop');
    document.getElementById('form-platform-web').checked = platforms.includes('web');
    document.getElementById('form-platform-mobile').checked = platforms.includes('mobile');

    updateBadgeLivePreview();
    appModal.classList.add('active');
  }

  function saveAppFromForm(e) {
    e.preventDefault();
    const name = document.getElementById('form-app-name').value.trim();
    if (!name) return alert('App name is required');

    let code = document.getElementById('form-app-code').value.trim();
    if (!code) {
      code = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    }

    const platforms = [];
    if (document.getElementById('form-platform-desktop').checked) platforms.push('desktop');
    if (document.getElementById('form-platform-web').checked) platforms.push('web');
    if (document.getElementById('form-platform-mobile').checked) platforms.push('mobile');
    if (platforms.length === 0) platforms.push('web');

    const appData = {
      id: editingAppId || ('pt-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-')),
      name: name,
      code: code,
      category: document.getElementById('form-app-category').value,
      url: document.getElementById('form-app-url').value.trim(),
      protocol: document.getElementById('form-app-protocol').value.trim(),
      desktopPath: document.getElementById('form-app-desktop-path').value.trim(),
      installUrl: document.getElementById('form-app-install-url').value.trim(),
      description: document.getElementById('form-app-desc').value.trim(),
      color: document.getElementById('form-app-color').value,
      installed: document.getElementById('form-app-installed').checked,
      platforms: platforms,
      pinned: false,
      hidden: false
    };

    if (editingAppId) {
      const idx = apps.findIndex(a => a.id === editingAppId);
      if (idx >= 0) {
        apps[idx] = { ...apps[idx], ...appData };
        showToast(`Updated "${name}"`);
      }
    } else {
      appData.order = apps.length;
      apps.push(appData);
      showToast(`Added "${name}" to Protutech Suite`);
    }

    saveApps();
    render();
    closeModal(appModal);
  }

  function deleteCurrentApp() {
    if (!editingAppId) return;
    const app = apps.find(a => a.id === editingAppId);
    if (!app) return;
    if (confirm(`Are you sure you want to delete "${app.name}" from your suite?`)) {
      apps = apps.filter(a => a.id !== editingAppId);
      saveApps();
      render();
      closeModal(appModal);
      showToast(`Deleted "${app.name}"`);
    }
  }

  function updateBadgeLivePreview() {
    const previewEl = document.getElementById('badge-live-preview');
    const name = document.getElementById('form-app-name').value.trim();
    let code = document.getElementById('form-app-code').value.trim();
    const color = document.getElementById('form-app-color').value;

    if (!code) {
      code = name ? name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'Pt';
    }

    if (previewEl) {
      previewEl.textContent = code;
      previewEl.style.background = color;
    }
  }

  // ==========================================================================
  // HIDDEN APPS MANAGEMENT
  // ==========================================================================
  function openHiddenAppsModal() {
    const listEl = document.getElementById('hidden-apps-list');
    const hidden = apps.filter(a => a.hidden);

    if (hidden.length === 0) {
      listEl.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px;">No apps are currently hidden.</p>';
    } else {
      listEl.innerHTML = hidden.map(app => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:var(--bg-input); border-radius:8px; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:32px; height:32px; border-radius:8px; background:${app.color}; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#fff;">
              ${app.code || app.name.substring(0, 2)}
            </div>
            <div>
              <div style="font-weight:600; font-size:13.5px;">${app.name}</div>
              <div style="font-size:11px; color:var(--text-dim);">${app.category}</div>
            </div>
          </div>
          <button class="header-btn" onclick="window.ProtutechDash.restoreApp('${app.id}')">Restore</button>
        </div>
      `).join('');
    }

    hiddenAppsModal.classList.add('active');
  }

  function restoreApp(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    app.hidden = false;
    saveApps();
    render();
    openHiddenAppsModal();
    showToast(`Restored "${app.name}"`);
  }

  function restoreAllHidden() {
    apps.forEach(a => { a.hidden = false; });
    saveApps();
    render();
    closeModal(hiddenAppsModal);
    showToast('Restored all hidden apps');
  }

  // ==========================================================================
  // ADMIN ACCESS & DISALLOWED WEBSITES POLICY
  // ==========================================================================
  const adminModal = document.getElementById('admin-modal');

  function openAdminModal() {
    const authScreen = document.getElementById('admin-auth-screen');
    const panelScreen = document.getElementById('admin-panel-screen');
    const pinInput = document.getElementById('admin-pin-input');
    const previewCheckbox = document.getElementById('admin-preview-mode-checkbox');

    if (previewCheckbox) previewCheckbox.checked = adminPreviewMode;

    if (isAdminUnlocked) {
      if (authScreen) authScreen.style.display = 'none';
      if (panelScreen) panelScreen.style.display = 'block';
      renderAdminDisallowList();
    } else {
      if (authScreen) authScreen.style.display = 'block';
      if (panelScreen) panelScreen.style.display = 'none';
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 100);
      }
    }

    if (adminModal) adminModal.classList.add('active');
  }

  function submitAdminPin(e) {
    if (e) e.preventDefault();
    const pinInput = document.getElementById('admin-pin-input');
    if (!pinInput) return;
    const entered = pinInput.value.trim();

    if (entered === adminPin) {
      isAdminUnlocked = true;
      sessionStorage.setItem('protutech_admin_unlocked', 'true');
      document.getElementById('admin-auth-screen').style.display = 'none';
      document.getElementById('admin-panel-screen').style.display = 'block';
      renderAdminDisallowList();
      updateStats();
      showToast('Admin Mode Unlocked');
    } else {
      alert('Incorrect Admin Passkey. Please try again.');
      pinInput.value = '';
      pinInput.focus();
    }
  }

  function lockAdmin() {
    isAdminUnlocked = false;
    sessionStorage.removeItem('protutech_admin_unlocked');
    adminPreviewMode = false;
    localStorage.setItem(STORAGE_KEY_ADMIN_PREVIEW, 'false');
    const authScreen = document.getElementById('admin-auth-screen');
    const panelScreen = document.getElementById('admin-panel-screen');
    if (authScreen) authScreen.style.display = 'block';
    if (panelScreen) panelScreen.style.display = 'none';
    updateStats();
    render();
    showToast('Admin Mode Locked');
  }

  function renderAdminDisallowList() {
    const listEl = document.getElementById('admin-disallow-list');
    const allowedCountEl = document.getElementById('admin-allowed-count');
    const blockedSummaryEl = document.getElementById('admin-blocked-summary');
    if (!listEl) return;

    // Build comprehensive list of all known protutech ecosystem services & apps
    const serviceMap = new Map();

    // 1. Current registered apps
    apps.forEach(app => {
      let host = '';
      if (app.url) {
        try {
          let u = app.url.startsWith('http') ? app.url : 'https://' + app.url;
          host = new URL(u).hostname.toLowerCase();
        } catch (e) {}
      }
      serviceMap.set(app.id, {
        id: app.id,
        name: app.name,
        code: app.code || 'Pt',
        color: app.color || '#00F2FE',
        domain: host || `${app.id}.protutech.vip`,
        subdomain: host.replace('.protutech.vip', '') || app.id
      });
    });

    // 2. Known ecosystem defaults
    Object.keys(PROTUTECH_SERVICES_REGISTRY).forEach(sub => {
      const serv = PROTUTECH_SERVICES_REGISTRY[sub];
      if (!serviceMap.has(serv.id)) {
        serviceMap.set(serv.id, {
          id: serv.id,
          name: serv.name,
          code: serv.code,
          color: serv.color,
          domain: `${sub}.protutech.vip`,
          subdomain: sub
        });
      }
    });

    // 3. Custom disallowed entries
    disallowedSites.forEach(blockedItem => {
      if (!Array.from(serviceMap.values()).some(s => s.id === blockedItem || s.domain === blockedItem || s.subdomain === blockedItem)) {
        serviceMap.set(blockedItem, {
          id: blockedItem,
          name: blockedItem,
          code: 'BLK',
          color: '#ef4444',
          domain: blockedItem,
          subdomain: blockedItem
        });
      }
    });

    const allServices = Array.from(serviceMap.values());
    let blockedCount = 0;

    listEl.innerHTML = allServices.map(item => {
      const isBlocked = disallowedSites.includes(item.id) || 
                        disallowedSites.includes(item.domain) || 
                        disallowedSites.includes(item.subdomain);
      if (isBlocked) blockedCount++;

      return `
        <div class="disallowed-website-row ${isBlocked ? 'is-blocked' : ''}">
          <div class="disallowed-info">
            <div class="disallowed-badge" style="background: ${item.color};">
              ${item.code}
            </div>
            <div>
              <div class="disallowed-name">${item.name}</div>
              <div class="disallowed-domain">${item.domain}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            ${isBlocked ? '<span class="disallowed-tag">Disallowed</span>' : '<span style="font-size: 11px; color: var(--color-success); font-weight: 600;">Allowed</span>'}
            <label class="switch">
              <input type="checkbox" ${isBlocked ? 'checked' : ''} onchange="window.ProtutechDash.toggleDisallowSite('${item.domain}', this.checked)">
              <span class="slider" style="${isBlocked ? 'background-color: #ef4444; border-color: #ef4444;' : ''}"></span>
            </label>
          </div>
        </div>
      `;
    }).join('');

    if (allowedCountEl) allowedCountEl.textContent = allServices.length - blockedCount;
    if (blockedSummaryEl) blockedSummaryEl.textContent = blockedCount;
    const badgeEl = document.getElementById('admin-blocked-count');
    if (badgeEl) badgeEl.textContent = blockedCount;
  }

  function toggleDisallowSite(siteKey, shouldDisallow) {
    const cleanKey = siteKey.toLowerCase().trim();
    if (shouldDisallow) {
      if (!disallowedSites.includes(cleanKey)) {
        disallowedSites.push(cleanKey);
      }
    } else {
      disallowedSites = disallowedSites.filter(s => s !== cleanKey && !cleanKey.includes(s));
    }

    localStorage.setItem(STORAGE_KEY_DISALLOWED_SITES, JSON.stringify(disallowedSites));
    renderAdminDisallowList();
    render();
    updateStats();
    showToast(shouldDisallow ? `Disallowed "${cleanKey}" from suite list` : `Allowed "${cleanKey}" in suite list`);
  }

  function addCustomDisallow() {
    const input = document.getElementById('admin-custom-disallow-input');
    if (!input) return;
    const val = input.value.trim().toLowerCase();
    if (!val) {
      alert('Please enter a website or subdomain to disallow.');
      return;
    }

    let normalized = val.replace(/^https?:\/\//, '');
    if (!disallowedSites.includes(normalized)) {
      disallowedSites.push(normalized);
      localStorage.setItem(STORAGE_KEY_DISALLOWED_SITES, JSON.stringify(disallowedSites));
      input.value = '';
      renderAdminDisallowList();
      render();
      updateStats();
      showToast(`Disallowed "${normalized}"`);
    } else {
      alert(`"${normalized}" is already on the disallowed list.`);
    }
  }

  function clearAllDisallowed() {
    if (confirm('Allow all websites again and clear the disallowed blocklist?')) {
      disallowedSites = [];
      localStorage.setItem(STORAGE_KEY_DISALLOWED_SITES, JSON.stringify(disallowedSites));
      renderAdminDisallowList();
      render();
      updateStats();
      showToast('Cleared all disallowed rules');
    }
  }

  function changeAdminPin() {
    const cur = prompt('Enter CURRENT Admin Passkey:');
    if (cur !== adminPin) {
      alert('Current passkey incorrect.');
      return;
    }
    const newPin = prompt('Enter NEW Admin Passkey (min 4 characters):');
    if (!newPin || newPin.length < 4) {
      alert('Passkey must be at least 4 characters long.');
      return;
    }
    adminPin = newPin;
    localStorage.setItem(STORAGE_KEY_ADMIN_PIN, newPin);
    showToast('Admin Passkey updated successfully');
  }

  function toggleAdminPreview(enabled) {
    adminPreviewMode = enabled;
    localStorage.setItem(STORAGE_KEY_ADMIN_PREVIEW, enabled);
    render();
    showToast(enabled ? 'Admin Preview: Showing disallowed apps with red border' : 'Admin Preview: Hiding disallowed apps');
  }

  // ==========================================================================
  // IN-APP EMBED CODE GENERATOR MODAL
  // ==========================================================================
  function openEmbedModal() {
    embedModal.classList.add('active');
  }

  function copyEmbedCode(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied integration snippet to clipboard!');
    }).catch(() => {
      alert('Copied to clipboard');
    });
  }

  // ==========================================================================
  // THEMING ENGINE
  // ==========================================================================
  function applyTheme(theme) {
    activeTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' ? `${ICONS.sun} <span>Light</span>` : `${ICONS.moon} <span>Dark</span>`;
    }
  }

  function applyPalette(palette) {
    activePalette = palette;
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem(STORAGE_KEY_PALETTE, palette);
  }

  function toggleTheme() {
    applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
  }

  // ==========================================================================
  // BACKUP & RESTORE
  // ==========================================================================
  function exportConfig() {
    const data = JSON.stringify({
      version: '1.0.0',
      apps: apps,
      disallowedSites: disallowedSites
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protutechdash-apps-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported suite configuration & policy');
  }

  function importConfig(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          apps = imported;
        } else if (imported && Array.isArray(imported.apps)) {
          apps = imported.apps;
          if (Array.isArray(imported.disallowedSites)) {
            disallowedSites = imported.disallowedSites;
            localStorage.setItem(STORAGE_KEY_DISALLOWED_SITES, JSON.stringify(disallowedSites));
          }
        } else {
          alert('Invalid format: Expected array of apps or valid suite config');
          return;
        }
        saveApps();
        render();
        updateStats();
        showToast('Imported apps configuration & policy successfully');
      } catch (err) {
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  }

  function resetToDefaults() {
    if (confirm('Reset all apps to original Protutech Suite defaults?')) {
      localStorage.removeItem(STORAGE_KEY_APPS);
      loadApps();
      showToast('Reset to defaults');
    }
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(msg, type = 'info') {
    let toast = document.getElementById('pt-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pt-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid rgba(0, 242, 254, 0.4);
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 13.5px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(0,242,254,0.2);
        z-index: 9999;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      document.body.appendChild(toast);
    }
    const icon = type === 'error' ? ICONS.ban : (type === 'success' ? ICONS.check : ICONS.info);
    toast.innerHTML = `${icon} <span>${msg}</span>`;
    toast.style.color = type === 'error' ? '#f87171' : '#f8fafc';
    toast.style.borderColor = type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 242, 254, 0.4)';
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
    }, 2800);
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  // ==========================================================================
  // EVENT LISTENERS & SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Theme & Palette
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (paletteSelect) {
      paletteSelect.value = activePalette;
      paletteSelect.addEventListener('change', (e) => applyPalette(e.target.value));
    }

    // Platform Filter & Simulator
    if (platformFilterSelect) {
      platformFilterSelect.value = platformFilterMode;
      platformFilterSelect.addEventListener('change', (e) => {
        platformFilterMode = e.target.value;
        localStorage.setItem(STORAGE_KEY_PLATFORM_FILTER, platformFilterMode);
        render();
      });
    }

    if (platformSimulatorSelect) {
      platformSimulatorSelect.value = simulatedPlatform;
      platformSimulatorSelect.addEventListener('change', (e) => {
        simulatedPlatform = e.target.value;
        localStorage.setItem(STORAGE_KEY_SIMULATED_PLATFORM, simulatedPlatform);
        render();
      });
    }

    // View Mode Pills
    document.querySelectorAll('.view-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewMode = btn.getAttribute('data-view');
        localStorage.setItem(STORAGE_KEY_VIEW_MODE, viewMode);
        render();
      });
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        render();
      });
    }

    // Category navigation
    document.querySelectorAll('.nav-item[data-cat]').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentCategory = item.getAttribute('data-cat');
        render();
      });
    });

    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Modals close buttons
    document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
        }
      });
    });

    // Form inputs live preview
    const nameInput = document.getElementById('form-app-name');
    const codeInput = document.getElementById('form-app-code');
    const colorInput = document.getElementById('form-app-color');
    if (nameInput) nameInput.addEventListener('input', updateBadgeLivePreview);
    if (codeInput) codeInput.addEventListener('input', updateBadgeLivePreview);
    if (colorInput) colorInput.addEventListener('input', updateBadgeLivePreview);

    const appForm = document.getElementById('app-form');
    if (appForm) appForm.addEventListener('submit', saveAppFromForm);

    const deleteBtn = document.getElementById('btn-delete-app');
    if (deleteBtn) deleteBtn.addEventListener('click', deleteCurrentApp);

    // Color preset dots in modal
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
        dot.classList.add('selected');
        const color = dot.getAttribute('data-color');
        if (colorInput) colorInput.value = color;
        updateBadgeLivePreview();
      });
    });

    // URL Detect input listeners
    const urlDetectInput = document.getElementById('url-detect-input');
    if (urlDetectInput) {
      urlDetectInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = urlDetectInput.value.trim();
          if (val) addOrFocusAppFromUrl(val);
        }
      });
    }

    // Modal Form URL Auto-Fill on protutech.vip domain input
    const formUrlInput = document.getElementById('form-app-url');
    if (formUrlInput) {
      formUrlInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val.includes('protutech.vip')) {
          const parsed = validateAndParseProtutechUrl(val);
          if (parsed.valid && parsed.app) {
            const currentName = document.getElementById('form-app-name').value;
            if (!currentName) {
              document.getElementById('form-app-name').value = parsed.app.name;
              document.getElementById('form-app-code').value = parsed.app.code;
              document.getElementById('form-app-category').value = parsed.app.category;
              document.getElementById('form-app-color').value = parsed.app.color;
              document.getElementById('form-app-desc').value = parsed.app.description;
              updateBadgeLivePreview();
            }
          }
        }
      });
    }

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Escape closes open modals
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      }
      // '/' or 'Ctrl+K' focuses search
      if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
      // 'Ctrl+D' toggles dark/light theme
      if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      }
      // '1' to '9' quick launch pinned apps
      if (e.key >= '1' && e.key <= '9' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const pinned = apps.filter(a => !a.hidden && a.pinned);
        const index = parseInt(e.key, 10) - 1;
        if (pinned[index]) {
          launchApp(pinned[index]);
        }
      }
    });

    // Check URL parameters for shortcut auto-launch
    const params = new URLSearchParams(window.location.search);
    const autoLaunchId = params.get('launch');
    if (autoLaunchId) {
      setTimeout(() => {
        const found = apps.find(a => a.id === autoLaunchId);
        if (found) launchApp(found);
      }, 500);
    }
  }

  // ==========================================================================
  // PWA REGISTRATION
  // ==========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('[PWA] Service Worker registered.'))
        .catch(err => console.log('[PWA] Service Worker registration note:', err));
    }
  }

  // ==========================================================================
  // EXPOSE GLOBAL API
  // ==========================================================================
  window.ProtutechDash = {
    launch: (id) => { const a = apps.find(x => x.id === id); if (a) launchApp(a); },
    launchInApp: (id) => { const a = apps.find(x => x.id === id); if (a) launchApp(a, true); },
    install: (id) => {
      const a = apps.find(x => x.id === id);
      if (a) window.open(a.installUrl || a.url, '_blank');
    },
    addAppFromUrlInput: () => {
      const el = document.getElementById('url-detect-input');
      if (el && el.value.trim()) {
        addOrFocusAppFromUrl(el.value.trim());
      } else {
        alert('Please enter a protutech.vip URL (e.g. homebox.protutech.vip)');
      }
    },
    quickAddChip: (subdomainUrl) => {
      const el = document.getElementById('url-detect-input');
      if (el) el.value = subdomainUrl;
      addOrFocusAppFromUrl(subdomainUrl);
    },
    focusUrlInput: () => {
      const bar = document.getElementById('url-detector-bar');
      const input = document.getElementById('url-detect-input');
      if (bar && input) {
        bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input.focus();
        input.select();
      }
    },
    openAdminModal,
    submitAdminPin,
    lockAdmin,
    toggleDisallowSite,
    addCustomDisallow,
    clearAllDisallowed,
    changeAdminPin,
    toggleAdminPreview,
    togglePin,
    toggleHide,
    toggleInstalled,
    moveOrder,
    openAddAppModal,
    openEmbedModal,
    openHiddenAppsModal,
    closeRunner: closeInAppRunner,
    restoreApp,
    restoreAllHidden,
    editApp,
    copyEmbedCode,
    exportConfig,
    importConfig,
    resetToDefaults,
    inspectElement,
    setPeriodicSeriesFilter,
    resetFilters: () => {
      currentCategory = 'all';
      currentSearchQuery = '';
      activePeriodicSeries = 'all';
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      const allItem = document.querySelector('.nav-item[data-cat="all"]');
      if (allItem) allItem.classList.add('active');
      render();
    }
  };

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(activeTheme);
    applyPalette(activePalette);
    setupEventListeners();
    loadApps();
    checkDesktopBridge();
    registerServiceWorker();
  });
})();
