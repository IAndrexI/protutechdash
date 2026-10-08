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

  // State
  let apps = [];
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
      activeDeviceBadge.textContent = effective === 'mobile' ? '📱 Mobile' : '💻 Desktop';
      if (simulatedPlatform !== 'auto') {
        activeDeviceBadge.textContent += ' (Simulated)';
      }
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
      showToast(`❌ ${parseResult.error}`);
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

      showToast(`✨ Focused existing app: "${existing.name}"`);
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

    showToast(`🚀 Added "${detectedApp.name}" (${parseResult.subdomain}.protutech.vip) to your dashboard!`);
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
          showToast(`🚀 Launched ${app.name} via Local Desktop Bridge!`);
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

    const effectivePlatform = getEffectivePlatform();
    const query = currentSearchQuery.trim().toLowerCase();

    // Filter & Sort
    let visibleApps = apps.filter(app => {
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

    // Apply view mode classes
    appsGrid.className = `apps-grid ${viewMode === 'list' ? 'list-view' : (viewMode === 'compact' ? 'compact' : '')}`;

    if (visibleApps.length === 0) {
      appsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 18px; color: var(--text-muted); margin-bottom: 8px;">No Apps Found</h3>
          <p style="font-size: 13.5px;">No applications match the current filter or search criteria.</p>
          <button class="header-btn primary" style="margin-top: 16px;" onclick="window.ProtutechDash.resetFilters()">Reset All Filters</button>
        </div>
      `;
      updateStats();
      return;
    }

    // Render Cards
    appsGrid.innerHTML = visibleApps.map((app, index) => {
      const isInstalled = app.installed !== false;
      const isPlatformCompatible = (app.platforms || []).includes(effectivePlatform) || (app.platforms || []).includes('web');
      
      // Determine Grayed-Out / Incompatible status
      const cardClasses = [
        'app-card',
        isInstalled ? 'installed' : 'not-installed',
        isPlatformCompatible ? '' : 'incompatible-platform',
        app.pinned ? 'is-pinned' : ''
      ].filter(Boolean).join(' ');

      // Adobe style badge gradient
      const badgeBg = app.color || '#00f2fe';
      const initials = app.code || (app.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase());

      // Platform Badges
      const platformTagsHtml = (app.platforms || []).map(p => {
        const icon = p === 'desktop' ? '💻' : (p === 'mobile' ? '📱' : '🌐');
        return `<span class="platform-tag">${icon} ${p}</span>`;
      }).join('');

      // Status Badge
      let statusBadgeHtml = '';
      if (!isInstalled) {
        statusBadgeHtml = '<span class="status-badge not-installed">Not Installed</span>';
      } else if (!isPlatformCompatible) {
        statusBadgeHtml = `<span class="status-badge incompatible">⚠️ ${effectivePlatform === 'mobile' ? 'Desktop' : 'Mobile'} Only</span>`;
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
            <span>⛶</span>
          </button>
        `;
      } else {
        actionBtnHtml = `
          <button class="btn-install" onclick="window.ProtutechDash.install('${app.id}')" title="Install or Setup ${app.name}">
            <span>Install / Setup</span>
          </button>
          <button class="btn-more-options" onclick="window.ProtutechDash.toggleInstalled('${app.id}')" title="Mark as Installed on this machine">
            <span>✓</span>
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
                ${app.pinned ? '📌' : '📍'}
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.toggleHide('${app.id}')" 
                      title="Hide App">
                👁️
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.editApp('${app.id}')" 
                      title="Edit App Details">
                ✏️
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.moveOrder('${app.id}', -1)" 
                      title="Move Left/Up">
                ◀
              </button>
              <button class="quick-icon-btn" 
                      onclick="window.ProtutechDash.moveOrder('${app.id}', 1)" 
                      title="Move Right/Down">
                ▶
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

  function updateStats() {
    const total = apps.filter(a => !a.hidden).length;
    const installed = apps.filter(a => !a.hidden && a.installed !== false).length;
    const web = apps.filter(a => !a.hidden && (a.platforms || []).includes('web')).length;

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
        else if (cat === 'favorites') badge.textContent = apps.filter(a => !a.hidden && a.pinned).length;
        else badge.textContent = apps.filter(a => !a.hidden && a.category === cat).length;
      }
    });
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
    showToast(app.pinned ? `📌 Pinned ${app.name} to top` : `Unpinned ${app.name}`);
  }

  function toggleHide(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    app.hidden = true;
    saveApps();
    render();
    showToast(`👁️ Hidden ${app.name}. Restore anytime from "Manage Hidden".`);
  }

  function toggleInstalled(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    app.installed = !app.installed;
    saveApps();
    render();
    showToast(app.installed ? `✓ Marked ${app.name} as Installed` : `Marked ${app.name} as Not Installed`);
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
      themeToggleBtn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
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
    const data = JSON.stringify(apps, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protutechdash-apps-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported suite configuration');
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
          saveApps();
          render();
          showToast('Imported apps configuration successfully');
        } else {
          alert('Invalid format: Expected array of apps');
        }
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
  function showToast(msg) {
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
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
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
    resetFilters: () => {
      currentCategory = 'all';
      currentSearchQuery = '';
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
