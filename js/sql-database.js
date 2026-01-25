/**
 * AIByJob SQL Database Manager
 * ==================================
 * Browser-based SQLite database using sql.js
 * - Create/manage databases
 * - Run SQL queries
 * - Import/export .db files
 * - Auto-save to localStorage or IndexedDB
 * - Multiple backend locations (browser, local server, GitHub, Supabase, Turso)
 */

const SQLDatabase = {
  db: null,
  isLoaded: false,
  SQL: null,
  history: [],
  
  // Site identifier (used to filter users in shared database)
  SITE_ID: 'AIByJob',
  
  // Storage keys
  STORAGE_KEY: 'aibyjob_sqldb',
  HISTORY_KEY: 'aibyjob_sql_history',
  LOCATION_KEY: 'aibyjob_db_location',
  
  // Current location config
  location: 'browser',
  locationConfig: {},
  
  // SHARED AIUNITES GitHub config (same database for all AIUNITES sites)
  DEFAULT_GITHUB_CONFIG: {
    owner: 'AIUNITES',
    repo: 'AIUNITES-database-sync',
    path: 'data/app.db',
    token: '',
    autoSync: false
  },
  
  // ==================== SIMPLE TOKEN MANAGEMENT ====================
  
  setGitHubToken(token) {
    if (token) {
      localStorage.setItem('github_token', token);
      if (!this.locationConfig.githubSync) {
        this.locationConfig.githubSync = { ...this.DEFAULT_GITHUB_CONFIG };
      }
      this.locationConfig.githubSync.token = token;
      this.saveLocationConfig();
      console.log('[SQLDatabase] GitHub token saved');
    } else {
      localStorage.removeItem('github_token');
      if (this.locationConfig.githubSync) {
        this.locationConfig.githubSync.token = '';
        this.saveLocationConfig();
      }
    }
  },
  
  hasGitHubToken() {
    return !!localStorage.getItem('github_token') || 
           !!(this.locationConfig.githubSync && this.locationConfig.githubSync.token);
  },
  
  getGitHubToken() {
    return localStorage.getItem('github_token') || 
           (this.locationConfig.githubSync && this.locationConfig.githubSync.token) || 
           '';
  },
  
  // Database location types
  LOCATIONS: {
    browser: { name: 'Browser', icon: '💻', requiresConfig: false },
    localServer: { name: 'Local Server', icon: '🖥️', requiresConfig: true },
    githubSync: { name: 'GitHub Sync', icon: '🐙', requiresConfig: true },
    supabase: { name: 'Supabase', icon: '⚡', requiresConfig: true },
    turso: { name: 'Turso', icon: '🚀', requiresConfig: true }
  },
  
  async init() {
    try {
      this.SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
      });
      
      console.log('[SQLDatabase] sql.js loaded successfully');
      
      this.loadLocationConfig();
      
      // When online (not localhost), ALWAYS try GitHub first for shared database
      if (!this.isLocalhost()) {
        console.log('[SQLDatabase] Online mode - loading shared database from GitHub...');
        const loaded = await this.autoLoadFromGitHub();
        if (!loaded) {
          // Fallback to localStorage if GitHub fails
          console.log('[SQLDatabase] GitHub load failed, trying localStorage...');
          await this.loadFromStorage();
        }
      } else {
        // Localhost: use localStorage (development mode)
        console.log('[SQLDatabase] Localhost mode - using local database');
        await this.loadFromStorage();
      }
      
      // Ensure required tables exist
      if (this.isLoaded) {
        this.ensureTables();
      }
      
      this.loadHistory();
      this.bindEvents();
      this.updateStatus();
      this.refreshTables();
      this.updateLocationUI();
      
    } catch (error) {
      console.error('[SQLDatabase] Failed to initialize:', error);
      this.updateStatus('Error loading sql.js', 'error');
    }
  },
  
  isLocalhost() {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    return host === 'localhost' || 
           host === '127.0.0.1' || 
           host.startsWith('192.168.') || 
           host.startsWith('10.') ||
           protocol === 'file:';
  },
  
  async autoLoadFromGitHub() {
    try {
      const config = (this.locationConfig.githubSync && this.locationConfig.githubSync.owner) 
        ? this.locationConfig.githubSync 
        : this.DEFAULT_GITHUB_CONFIG;
      
      const path = config.path || 'data/app.db';
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
      
      console.log('[SQLDatabase] Auto-loading from:', apiUrl);
      
      const headers = {};
      if (config.token) {
        headers['Authorization'] = `token ${config.token}`;
      }
      
      const resp = await fetch(apiUrl, { headers });
      
      if (!resp.ok) {
        if (resp.status === 404) {
          console.log('[SQLDatabase] No database file found on GitHub at:', path);
        } else if (resp.status === 403) {
          console.warn('[SQLDatabase] GitHub API rate limit exceeded or access denied');
        } else {
          console.warn('[SQLDatabase] GitHub API error:', resp.status, resp.statusText);
        }
        return false;
      }
      
      const data = await resp.json();
      
      const binary = atob(data.content.replace(/\n/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      this.db = new this.SQL.Database(bytes);
      this.isLoaded = true;
      this.location = 'githubSync';
      
      if (config !== this.DEFAULT_GITHUB_CONFIG) {
        this.locationConfig.githubSync = config;
        this.saveLocationConfig();
      }
      
      console.log('[SQLDatabase] Auto-loaded from GitHub successfully!');
      console.log('[SQLDatabase] Database size:', bytes.length, 'bytes');
      
      const saveBtn = document.getElementById('sql-save-db-btn');
      if (saveBtn) saveBtn.disabled = false;
      
      if (typeof showToast === 'function') {
        showToast('🐙 Database loaded from GitHub!', 'success');
      }
      
      return true;
      
    } catch (error) {
      console.error('[SQLDatabase] Auto-load from GitHub failed:', error);
      return false;
    }
  },
  
  loadLocationConfig() {
    try {
      const saved = localStorage.getItem(this.LOCATION_KEY);
      if (saved) {
        const config = JSON.parse(saved);
        this.location = config.location || 'browser';
        this.locationConfig = config.configs || {};
      }
    } catch (e) {
      console.error('[SQLDatabase] Error loading location config:', e);
    }
  },
  
  saveLocationConfig() {
    const config = {
      location: this.location,
      configs: this.locationConfig,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.LOCATION_KEY, JSON.stringify(config));
  },
  
  updateLocationUI() {
    const statusEl = document.getElementById('db-location-status');
    if (statusEl) {
      const loc = this.LOCATIONS[this.location];
      statusEl.textContent = loc ? `${loc.icon} ${loc.name}` : 'Browser';
    }
    
    document.querySelectorAll('.db-location-card').forEach(card => {
      const cardLoc = card.dataset.location;
      if (cardLoc === this.location) {
        card.classList.add('active');
        const badge = card.querySelector('.db-loc-badge');
        const btn = card.querySelector('.btn-tiny');
        if (badge) badge.style.display = 'inline';
        if (btn) btn.style.display = 'none';
      } else {
        card.classList.remove('active');
        const badge = card.querySelector('.db-loc-badge');
        const btn = card.querySelector('.btn-tiny');
        if (badge) badge.style.display = 'none';
        if (btn) btn.style.display = 'inline';
      }
    });
  },
  
  configureLocation(locationType) {
    const modal = document.getElementById('db-location-modal');
    const title = document.getElementById('db-location-modal-title');
    
    if (!modal) return;
    
    document.querySelectorAll('.db-location-config-form').forEach(form => {
      form.style.display = 'none';
    });
    
    const configForm = document.getElementById(`config-${locationType}`);
    if (configForm) {
      configForm.style.display = 'block';
    }
    
    const loc = this.LOCATIONS[locationType];
    if (title && loc) {
      title.textContent = `Configure ${loc.icon} ${loc.name}`;
    }
    
    this.loadLocationFormValues(locationType);
    this.configuringLocation = locationType;
    
    const testResult = document.getElementById('db-location-test-result');
    if (testResult) {
      testResult.innerHTML = '';
    }
    
    modal.classList.add('active');
  },
  
  closeLocationModal() {
    const modal = document.getElementById('db-location-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    this.configuringLocation = null;
  },
  
  loadLocationFormValues(locationType) {
    const config = this.locationConfig[locationType] || {};
    
    switch (locationType) {
      case 'localServer':
        const serverUrl = document.getElementById('config-local-server-url');
        if (serverUrl) serverUrl.value = config.serverUrl || '';
        break;
        
      case 'githubSync':
        const ghConfig = Object.keys(config).length > 0 ? config : this.DEFAULT_GITHUB_CONFIG;
        const ghOwner = document.getElementById('config-gh-sync-owner');
        const ghRepo = document.getElementById('config-gh-sync-repo');
        const ghPath = document.getElementById('config-gh-sync-path');
        const ghToken = document.getElementById('config-gh-sync-token');
        const ghAuto = document.getElementById('config-gh-sync-auto');
        if (ghOwner) ghOwner.value = ghConfig.owner || '';
        if (ghRepo) ghRepo.value = ghConfig.repo || '';
        if (ghPath) ghPath.value = ghConfig.path || 'data/app.db';
        if (ghToken) ghToken.value = ghConfig.token || '';
        if (ghAuto) ghAuto.checked = ghConfig.autoSync !== false;
        break;
        
      case 'supabase':
        const sbUrl = document.getElementById('config-supabase-url');
        const sbKey = document.getElementById('config-supabase-key');
        if (sbUrl) sbUrl.value = config.url || '';
        if (sbKey) sbKey.value = config.key || '';
        break;
        
      case 'turso':
        const tursoUrl = document.getElementById('config-turso-url');
        const tursoToken = document.getElementById('config-turso-token');
        if (tursoUrl) tursoUrl.value = config.url || '';
        if (tursoToken) tursoToken.value = config.token || '';
        break;
    }
  },
  
  getLocationFormValues() {
    const locationType = this.configuringLocation;
    let config = {};
    
    switch (locationType) {
      case 'localServer':
        config = {
          serverUrl: document.getElementById('config-local-server-url')?.value.trim() || ''
        };
        break;
        
      case 'githubSync':
        config = {
          owner: document.getElementById('config-gh-sync-owner')?.value.trim() || '',
          repo: document.getElementById('config-gh-sync-repo')?.value.trim() || '',
          path: document.getElementById('config-gh-sync-path')?.value.trim() || 'data/app.db',
          token: document.getElementById('config-gh-sync-token')?.value.trim() || '',
          autoSync: document.getElementById('config-gh-sync-auto')?.checked !== false
        };
        break;
        
      case 'supabase':
        config = {
          url: document.getElementById('config-supabase-url')?.value.trim() || '',
          key: document.getElementById('config-supabase-key')?.value.trim() || ''
        };
        break;
        
      case 'turso':
        config = {
          url: document.getElementById('config-turso-url')?.value.trim() || '',
          token: document.getElementById('config-turso-token')?.value.trim() || ''
        };
        break;
        
      case 'browser':
        config = { enabled: true };
        break;
    }
    
    return config;
  },
  
  async testLocationConnection() {
    const locationType = this.configuringLocation;
    const config = this.getLocationFormValues();
    const resultEl = document.getElementById('db-location-test-result');
    
    if (!resultEl) return;
    
    resultEl.innerHTML = '<span class="testing">🔄 Testing connection...</span>';
    resultEl.className = 'test-result';
    
    try {
      let success = false;
      let message = '';
      
      switch (locationType) {
        case 'browser':
          success = true;
          message = 'localStorage is always available';
          break;
          
        case 'localServer':
          if (!config.serverUrl) throw new Error('Server URL is required');
          const serverResp = await fetch(`${config.serverUrl}/health`, { method: 'GET' });
          success = serverResp.ok;
          message = success ? 'Connected to local server' : `Failed: ${serverResp.status}`;
          break;
          
        case 'githubSync':
          if (!config.owner || !config.repo) throw new Error('Owner and repo are required');
          const ghResp = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
            headers: config.token ? { 'Authorization': `token ${config.token}` } : {}
          });
          success = ghResp.ok;
          message = success ? 'Connected to GitHub repository' : `Failed: ${ghResp.status}`;
          break;
          
        case 'supabase':
          if (!config.url || !config.key) throw new Error('URL and key are required');
          const sbResp = await fetch(`${config.url}/rest/v1/`, {
            headers: { 'apikey': config.key, 'Authorization': `Bearer ${config.key}` }
          });
          success = sbResp.ok || sbResp.status === 404;
          message = success ? 'Connected to Supabase' : `Failed: ${sbResp.status}`;
          break;
          
        case 'turso':
          if (!config.url) throw new Error('Database URL is required');
          success = config.url.startsWith('libsql://') || config.url.startsWith('https://');
          message = success ? 'Turso URL format valid' : 'Invalid URL format';
          break;
      }
      
      resultEl.innerHTML = success 
        ? `<span class="success">✅ ${message}</span>`
        : `<span class="error">❌ ${message}</span>`;
      resultEl.className = `test-result ${success ? 'success' : 'error'}`;
      
    } catch (error) {
      resultEl.innerHTML = `<span class="error">❌ Error: ${error.message}</span>`;
      resultEl.className = 'test-result error';
    }
  },
  
  saveLocationAndActivate() {
    const locationType = this.configuringLocation;
    const config = this.getLocationFormValues();
    
    this.locationConfig[locationType] = config;
    this.location = locationType;
    this.saveLocationConfig();
    this.updateLocationUI();
    this.closeLocationModal();
    
    if (typeof showToast === 'function') {
      const loc = this.LOCATIONS[locationType];
      showToast(`${loc.icon} ${loc.name} is now active`, 'success');
    }
    
    console.log('[SQLDatabase] Location activated:', locationType);
  },
  
  bindEvents() {
    document.getElementById('close-db-location-modal')?.addEventListener('click', () => {
      this.closeLocationModal();
    });
    
    document.getElementById('test-db-location-btn')?.addEventListener('click', () => {
      this.testLocationConnection();
    });
    
    document.getElementById('save-db-location-btn')?.addEventListener('click', () => {
      this.saveLocationAndActivate();
    });
    
    document.querySelector('.db-location-card[data-location="browser"]')?.addEventListener('click', () => {
      this.location = 'browser';
      this.saveLocationConfig();
      this.updateLocationUI();
      if (typeof showToast === 'function') {
        showToast('💻 Browser storage active', 'success');
      }
    });
    
    document.getElementById('sql-new-db-btn')?.addEventListener('click', () => {
      this.createNewDatabase();
    });
    
    document.getElementById('sql-load-file')?.addEventListener('change', (e) => {
      this.loadFromFile(e.target.files[0]);
    });
    
    document.getElementById('sql-save-db-btn')?.addEventListener('click', () => {
      this.saveToFile();
    });
    
    document.getElementById('sql-save-github-btn')?.addEventListener('click', () => {
      this.saveToGitHub();
    });
    
    document.getElementById('sql-load-github-btn')?.addEventListener('click', () => {
      this.loadFromGitHub();
    });
    
    document.getElementById('sql-run-btn')?.addEventListener('click', () => {
      this.runQuery();
    });
    
    document.getElementById('sql-clear-btn')?.addEventListener('click', () => {
      document.getElementById('sql-query-input').value = '';
    });
    
    document.getElementById('sql-examples-select')?.addEventListener('change', (e) => {
      this.insertExampleQuery(e.target.value);
      e.target.value = '';
    });
    
    document.getElementById('sql-refresh-tables-btn')?.addEventListener('click', () => {
      this.refreshTables();
    });
    
    document.getElementById('sql-create-table-btn')?.addEventListener('click', () => {
      this.showCreateTableDialog();
    });
    
    document.getElementById('sql-clear-history-btn')?.addEventListener('click', () => {
      this.clearHistory();
    });
    
    document.getElementById('sql-query-input')?.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runQuery();
      }
    });
  },
  
  createNewDatabase() {
    if (this.db && !confirm('This will replace the current database. Continue?')) {
      return;
    }
    
    this.db = new this.SQL.Database();
    this.isLoaded = true;
    
    this.updateStatus('New database created', 'success');
    this.refreshTables();
    this.autoSave();
    
    document.getElementById('sql-save-db-btn').disabled = false;
    console.log('[SQLDatabase] New database created');
  },
  
  async loadFromFile(file) {
    if (!file) return;
    
    try {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      
      this.db = new this.SQL.Database(data);
      this.isLoaded = true;
      
      this.updateStatus(`Loaded: ${file.name}`, 'success');
      this.refreshTables();
      this.autoSave();
      
      document.getElementById('sql-save-db-btn').disabled = false;
      console.log('[SQLDatabase] Loaded from file:', file.name);
      
    } catch (error) {
      console.error('[SQLDatabase] Load error:', error);
      this.updateStatus('Error loading file', 'error');
    }
  },
  
  saveToFile() {
    if (!this.db) {
      alert('No database to save');
      return;
    }
    
    try {
      const data = this.db.export();
      const blob = new Blob([data], { type: 'application/x-sqlite3' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `aibyjob_database_${Date.now()}.db`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      if (typeof showToast === 'function') {
        showToast('💾 Database saved to file', 'success');
      }
      
      console.log('[SQLDatabase] Saved to file');
      
    } catch (error) {
      console.error('[SQLDatabase] Save error:', error);
      alert('Error saving database');
    }
  },
  
  async saveToGitHub(tokenOverride) {
    if (!this.db) {
      alert('No database to save');
      return false;
    }
    
    let token = tokenOverride || this.getGitHubToken();
    
    if (!token) {
      token = prompt('Enter your GitHub Personal Access Token (needs repo write access):');
      if (!token) {
        if (typeof showToast === 'function') {
          showToast('GitHub token required', 'error');
        }
        return false;
      }
      if (confirm('Save token for future use? (stored in localStorage)')) {
        this.setGitHubToken(token);
      }
    }
    
    try {
      const config = this.locationConfig.githubSync || this.DEFAULT_GITHUB_CONFIG;
      const path = config.path || 'data/app.db';
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
      
      if (typeof showToast === 'function') {
        showToast('Saving to GitHub...', 'info');
      }
      
      let sha = null;
      try {
        const existingResp = await fetch(apiUrl, {
          headers: { 'Authorization': `token ${token}` }
        });
        if (existingResp.ok) {
          const existing = await existingResp.json();
          sha = existing.sha;
        }
      } catch (e) {}
      
      const data = this.db.export();
      const base64 = btoa(String.fromCharCode.apply(null, data));
      
      const body = {
        message: `Update database from ${this.SITE_ID} - ${new Date().toISOString()}`,
        content: base64,
        branch: config.branch || 'main'
      };
      if (sha) body.sha = sha;
      
      const resp = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (resp.ok) {
        if (typeof showToast === 'function') {
          showToast('🐙 Database saved to GitHub!', 'success');
        }
        console.log('[SQLDatabase] Saved to GitHub:', path);
        return true;
      } else {
        const error = await resp.json();
        throw new Error(error.message || 'GitHub API error');
      }
      
    } catch (error) {
      console.error('[SQLDatabase] GitHub save error:', error);
      if (typeof showToast === 'function') {
        showToast('Error saving to GitHub: ' + error.message, 'error');
      } else {
        alert('Error saving to GitHub: ' + error.message);
      }
      return false;
    }
  },
  
  async loadFromGitHub() {
    let config = this.locationConfig.githubSync;
    if (!config || !config.owner || !config.repo) {
      console.log('[SQLDatabase] No GitHub config found, using AIUNITES defaults');
      config = this.DEFAULT_GITHUB_CONFIG;
    }
    
    try {
      const path = config.path || 'data/app.db';
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
      
      const headers = {};
      if (config.token) {
        headers['Authorization'] = `token ${config.token}`;
      }
      
      const resp = await fetch(apiUrl, { headers });
      
      if (!resp.ok) {
        if (resp.status === 404) {
          alert('Database file not found on GitHub. Save one first!');
        } else {
          throw new Error(`GitHub API error: ${resp.status}`);
        }
        return;
      }
      
      const data = await resp.json();
      
      const binary = atob(data.content.replace(/\n/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      this.db = new this.SQL.Database(bytes);
      this.isLoaded = true;
      
      this.updateStatus('Loaded from GitHub', 'success');
      this.refreshTables();
      this.autoSave();
      
      document.getElementById('sql-save-db-btn').disabled = false;
      
      if (typeof showToast === 'function') {
        showToast('🐙 Database loaded from GitHub!', 'success');
      }
      
      console.log('[SQLDatabase] Loaded from GitHub:', path);
      
    } catch (error) {
      console.error('[SQLDatabase] GitHub load error:', error);
      alert('Error loading from GitHub: ' + error.message);
    }
  },
  
  autoSave() {
    if (!this.db) return;
    
    try {
      const data = this.db.export();
      const base64 = btoa(String.fromCharCode.apply(null, data));
      localStorage.setItem(this.STORAGE_KEY, base64);
      console.log('[SQLDatabase] Auto-saved to localStorage');
    } catch (error) {
      console.error('[SQLDatabase] Auto-save error:', error);
    }
  },
  
  async loadFromStorage() {
    try {
      const base64 = localStorage.getItem(this.STORAGE_KEY);
      if (!base64) return;
      
      const binary = atob(base64);
      const data = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        data[i] = binary.charCodeAt(i);
      }
      
      this.db = new this.SQL.Database(data);
      this.isLoaded = true;
      
      document.getElementById('sql-save-db-btn').disabled = false;
      console.log('[SQLDatabase] Loaded from localStorage');
      
    } catch (error) {
      console.error('[SQLDatabase] Load from storage error:', error);
    }
  },
  
  runQuery() {
    const input = document.getElementById('sql-query-input');
    const query = input.value.trim();
    
    if (!query) {
      alert('Please enter a SQL query');
      return;
    }
    
    if (!this.db) {
      this.createNewDatabase();
    }
    
    const startTime = performance.now();
    
    try {
      const results = this.db.exec(query);
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      
      document.getElementById('sql-query-time').textContent = `${duration}ms`;
      this.displayResults(results);
      this.addToHistory(query, true);
      
      if (this.isSchemaChange(query)) {
        this.refreshTables();
      }
      
      this.autoSave();
      console.log('[SQLDatabase] Query executed:', query);
      
    } catch (error) {
      console.error('[SQLDatabase] Query error:', error);
      this.displayError(error.message);
      this.addToHistory(query, false, error.message);
    }
  },
  
  isSchemaChange(query) {
    const schemaKeywords = ['CREATE', 'DROP', 'ALTER', 'RENAME'];
    const upperQuery = query.toUpperCase();
    return schemaKeywords.some(kw => upperQuery.includes(kw));
  },
  
  displayResults(results) {
    const container = document.getElementById('sql-results-container');
    const countEl = document.getElementById('sql-results-count');
    
    if (!results || results.length === 0) {
      container.innerHTML = '<div class="results-success">✅ Query executed successfully (no results)</div>';
      countEl.textContent = '';
      return;
    }
    
    let html = '';
    let totalRows = 0;
    
    results.forEach((result, idx) => {
      const { columns, values } = result;
      totalRows += values.length;
      
      html += `<div class="result-set">`;
      if (results.length > 1) {
        html += `<div class="result-set-header">Result Set ${idx + 1}</div>`;
      }
      html += `<div class="sql-table-wrapper"><table class="sql-results-table">`;
      
      html += '<thead><tr>';
      columns.forEach(col => {
        html += `<th>${this.escapeHtml(col)}</th>`;
      });
      html += '</tr></thead>';
      
      html += '<tbody>';
      values.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
          const displayValue = cell === null ? '<span class="null-value">NULL</span>' : this.escapeHtml(String(cell));
          html += `<td>${displayValue}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table></div></div>';
    });
    
    container.innerHTML = html;
    countEl.textContent = `${totalRows} row${totalRows !== 1 ? 's' : ''}`;
  },
  
  displayError(message) {
    const container = document.getElementById('sql-results-container');
    container.innerHTML = `<div class="results-error">❌ Error: ${this.escapeHtml(message)}</div>`;
    document.getElementById('sql-results-count').textContent = '';
  },
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  refreshTables() {
    const container = document.getElementById('sql-tables-list');
    if (!container) return;
    
    if (!this.db) {
      container.innerHTML = '<div class="empty-tables">No database loaded</div>';
      return;
    }
    
    try {
      const result = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
      
      if (!result.length || !result[0].values.length) {
        container.innerHTML = '<div class="empty-tables">No tables yet</div>';
        return;
      }
      
      let html = '';
      result[0].values.forEach(([tableName]) => {
        let rowCount = 0;
        try {
          const countResult = this.db.exec(`SELECT COUNT(*) FROM "${tableName}"`);
          rowCount = countResult[0]?.values[0]?.[0] || 0;
        } catch (e) {}
        
        html += `
          <div class="table-item" data-table="${tableName}">
            <span class="table-icon">📋</span>
            <span class="table-name">${this.escapeHtml(tableName)}</span>
            <span class="table-count">${rowCount} rows</span>
            <div class="table-actions">
              <button class="btn-tiny" onclick="SQLDatabase.selectAll('${tableName}')" title="SELECT *">👁️</button>
              <button class="btn-tiny" onclick="SQLDatabase.showTableSchema('${tableName}')" title="Schema">📄</button>
              <button class="btn-tiny danger" onclick="SQLDatabase.dropTable('${tableName}')" title="Drop">🗑️</button>
            </div>
          </div>
        `;
      });
      
      container.innerHTML = html;
      
    } catch (error) {
      console.error('[SQLDatabase] Refresh tables error:', error);
      container.innerHTML = '<div class="empty-tables">Error loading tables</div>';
    }
  },
  
  selectAll(tableName) {
    document.getElementById('sql-query-input').value = `SELECT * FROM "${tableName}" LIMIT 100;`;
    this.runQuery();
  },
  
  showTableSchema(tableName) {
    document.getElementById('sql-query-input').value = `PRAGMA table_info("${tableName}");`;
    this.runQuery();
  },
  
  dropTable(tableName) {
    if (confirm(`Are you sure you want to drop table "${tableName}"? This cannot be undone.`)) {
      document.getElementById('sql-query-input').value = `DROP TABLE "${tableName}";`;
      this.runQuery();
    }
  },
  
  showCreateTableDialog() {
    const tableName = prompt('Enter table name:');
    if (!tableName) return;
    
    const columns = prompt('Enter columns (e.g., id INTEGER PRIMARY KEY, name TEXT, email TEXT):');
    if (!columns) return;
    
    document.getElementById('sql-query-input').value = `CREATE TABLE "${tableName}" (\n  ${columns}\n);`;
    this.runQuery();
  },
  
  insertExampleQuery(type) {
    const examples = {
      select: 'SELECT * FROM table_name WHERE condition LIMIT 10;',
      create: `CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);`,
      insert: `INSERT INTO users (name, email) VALUES 
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com');`,
      update: `UPDATE users 
SET name = 'Updated Name' 
WHERE id = 1;`,
      delete: `DELETE FROM users 
WHERE id = 1;`,
      drop: 'DROP TABLE IF EXISTS table_name;'
    };
    
    if (examples[type]) {
      document.getElementById('sql-query-input').value = examples[type];
    }
  },
  
  addToHistory(query, success, error = null) {
    this.history.unshift({
      query,
      success,
      error,
      timestamp: new Date().toISOString()
    });
    
    this.history = this.history.slice(0, 50);
    this.saveHistory();
    this.renderHistory();
  },
  
  saveHistory() {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history));
  },
  
  loadHistory() {
    try {
      const saved = localStorage.getItem(this.HISTORY_KEY);
      if (saved) {
        this.history = JSON.parse(saved);
        this.renderHistory();
      }
    } catch (e) {
      this.history = [];
    }
  },
  
  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.renderHistory();
  },
  
  renderHistory() {
    const container = document.getElementById('sql-history-list');
    if (!container) return;
    
    if (!this.history.length) {
      container.innerHTML = '<div class="empty-history">No queries yet</div>';
      return;
    }
    
    let html = '';
    this.history.slice(0, 20).forEach((item, idx) => {
      const icon = item.success ? '✅' : '❌';
      const shortQuery = item.query.substring(0, 50) + (item.query.length > 50 ? '...' : '');
      
      html += `
        <div class="history-item ${item.success ? 'success' : 'error'}" onclick="SQLDatabase.useHistoryItem(${idx})">
          <span class="history-icon">${icon}</span>
          <span class="history-query">${this.escapeHtml(shortQuery)}</span>
        </div>
      `;
    });
    
    container.innerHTML = html;
  },
  
  useHistoryItem(index) {
    if (this.history[index]) {
      document.getElementById('sql-query-input').value = this.history[index].query;
    }
  },
  
  updateStatus(message = null, type = 'info') {
    const iconEl = document.getElementById('sql-status-icon');
    const textEl = document.getElementById('sql-status-text');
    
    if (!iconEl || !textEl) return;
    
    if (message) {
      textEl.textContent = message;
    } else if (this.isLoaded) {
      textEl.textContent = 'Database ready';
    } else {
      textEl.textContent = 'Database not loaded';
    }
    
    switch (type) {
      case 'success':
        iconEl.textContent = '🟢';
        break;
      case 'error':
        iconEl.textContent = '🔴';
        break;
      default:
        iconEl.textContent = this.isLoaded ? '🟢' : '⚪';
    }
  },
  
  // ==================== PASSWORD HASHING ====================
  
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  async verifyPassword(password, hash) {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hash || password === hash;
  },
  
  // ==================== SHARED DATABASE USER METHODS ====================
  
  ensureUsersTable() {
    if (!this.db) return;
    
    try {
      const tableExists = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
      
      if (!tableExists.length) {
        console.log('[SQLDatabase] Creating users table...');
        this.db.run(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            email TEXT,
            role TEXT DEFAULT 'user',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT,
            site TEXT DEFAULT 'AIByJob'
          )
        `);
        this.autoSave();
      } else {
        const columns = this.db.exec("PRAGMA table_info(users)");
        const hasSiteColumn = columns[0]?.values.some(col => col[1] === 'site');
        
        if (!hasSiteColumn) {
          console.log('[SQLDatabase] Adding site column to existing table...');
          this.db.run("ALTER TABLE users ADD COLUMN site TEXT DEFAULT 'AIByJob'");
          this.autoSave();
        }
      }
    } catch (error) {
      console.error('[SQLDatabase] ensureUsersTable error:', error);
    }
  },
  
  async authenticateUser(usernameOrEmail, password) {
    if (!this.db) return null;
    
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM users 
        WHERE site = ?
        AND (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?))
      `);
      
      stmt.bind([this.SITE_ID, usernameOrEmail, usernameOrEmail]);
      
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        
        const isValid = await this.verifyPassword(password, row.password_hash);
        
        if (!isValid) {
          console.log('[SQLDatabase] Invalid password for:', usernameOrEmail);
          return null;
        }
        
        this.db.run(`UPDATE users SET last_login = datetime('now') WHERE id = ?`, [row.id]);
        this.autoSave();
        
        console.log('[SQLDatabase] Auth successful:', row.username, '(site:', row.site, ')');
        
        return {
          id: row.id,
          username: row.username,
          displayName: row.display_name,
          email: row.email,
          role: row.role,
          createdAt: row.created_at,
          lastLogin: row.last_login,
          site: row.site
        };
      }
      
      stmt.free();
      return null;
    } catch (error) {
      console.error('[SQLDatabase] Auth error:', error);
      return null;
    }
  },
  
  getUserByUsername(username) {
    if (!this.db) return null;
    
    try {
      const stmt = this.db.prepare(`SELECT * FROM users WHERE site = ? AND LOWER(username) = LOWER(?)`);
      stmt.bind([this.SITE_ID, username]);
      
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return {
          id: row.id,
          username: row.username,
          displayName: row.display_name,
          email: row.email,
          role: row.role,
          createdAt: row.created_at,
          lastLogin: row.last_login,
          site: row.site
        };
      }
      stmt.free();
      return null;
    } catch (error) {
      console.error('[SQLDatabase] getUserByUsername error:', error);
      return null;
    }
  },
  
  usernameExists(username) {
    if (!this.db) return false;
    try {
      const stmt = this.db.prepare(`SELECT COUNT(*) FROM users WHERE site = ? AND LOWER(username) = LOWER(?)`);
      stmt.bind([this.SITE_ID, username]);
      stmt.step();
      const count = stmt.get()[0];
      stmt.free();
      return count > 0;
    } catch (error) {
      return false;
    }
  },
  
  async registerUser(userData) {
    if (!this.db) throw new Error('Database not available');
    
    if (this.usernameExists(userData.username)) {
      throw new Error('Username already taken');
    }
    
    try {
      const passwordHash = await this.hashPassword(userData.password);
      
      this.db.run(`
        INSERT INTO users (username, password_hash, display_name, email, role, site)
        VALUES (?, ?, ?, ?, 'user', ?)
      `, [
        userData.username.toLowerCase(),
        passwordHash,
        userData.displayName || userData.username,
        userData.email?.toLowerCase() || '',
        this.SITE_ID
      ]);
      
      this.autoSave();
      
      console.log('[SQLDatabase] User registered:', userData.username, 'for site:', this.SITE_ID);
      return this.getUserByUsername(userData.username);
    } catch (error) {
      console.error('[SQLDatabase] Register error:', error);
      throw new Error('Registration failed: ' + error.message);
    }
  },
  
  async updatePassword(userId, newPassword) {
    if (!this.db) return false;
    
    try {
      const passwordHash = await this.hashPassword(newPassword);
      
      this.db.run(`
        UPDATE users SET password_hash = ?
        WHERE id = ? AND site = ?
      `, [passwordHash, userId, this.SITE_ID]);
      
      this.autoSave();
      return true;
    } catch (error) {
      console.error('[SQLDatabase] Update password error:', error);
      return false;
    }
  },
  
  /**
   * Ensure required tables exist (called after database load)
   */
  ensureTables() {
    if (!this.db) return;
    this.ensureUsersTable();
    console.log('[SQLDatabase] Tables ensured');
  },
  
  /**
   * Ensure users table exists with site column
   */
  ensureUsersTable() {
    if (!this.db) return;
    
    try {
      const tableExists = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
      
      if (!tableExists.length) {
        console.log('[SQLDatabase] Creating users table...');
        this.db.run(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            email TEXT,
            role TEXT DEFAULT 'user',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT,
            site TEXT DEFAULT 'AIByJob'
          )
        `);
        this.autoSave();
      } else {
        // Check if site column exists
        const columns = this.db.exec("PRAGMA table_info(users)");
        const hasSiteColumn = columns[0]?.values.some(col => col[1] === 'site');
        
        if (!hasSiteColumn) {
          console.log('[SQLDatabase] Adding site column to existing table...');
          this.db.run("ALTER TABLE users ADD COLUMN site TEXT DEFAULT 'AIByJob'");
          this.autoSave();
        }
      }
    } catch (error) {
      console.error('[SQLDatabase] ensureUsersTable error:', error);
    }
  },
  
  getAllUsersForSite() {
    if (!this.db) return [];
    
    try {
      const result = this.db.exec(`
        SELECT id, username, display_name, email, role, created_at, last_login, site
        FROM users WHERE site = '${this.SITE_ID}' ORDER BY created_at DESC
      `);
      if (!result.length) return [];
      
      const columns = result[0].columns;
      return result[0].values.map(row => {
        const user = {};
        columns.forEach((col, i) => user[col] = row[i]);
        return {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          lastLogin: user.last_login,
          site: user.site
        };
      });
    } catch (error) {
      console.error('[SQLDatabase] getAllUsersForSite error:', error);
      return [];
    }
  },
  
  getAllUsersAllSites() {
    if (!this.db) return [];
    
    try {
      const result = this.db.exec(`
        SELECT id, username, display_name, email, role, created_at, last_login, site
        FROM users ORDER BY site ASC, username ASC
      `);
      if (!result.length) return [];
      
      const columns = result[0].columns;
      return result[0].values.map(row => {
        const user = {};
        columns.forEach((col, i) => user[col] = row[i]);
        return {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          lastLogin: user.last_login,
          site: user.site
        };
      });
    } catch (error) {
      console.error('[SQLDatabase] getAllUsersAllSites error:', error);
      return [];
    }
  },
  
  getSiteStatus() {
    if (!this.db) return { loaded: false, hasDatabase: false, userCount: 0, site: this.SITE_ID };
    
    try {
      const totalResult = this.db.exec("SELECT COUNT(*) FROM users");
      const totalCount = totalResult[0]?.values[0]?.[0] || 0;
      
      const siteResult = this.db.exec(`SELECT COUNT(*) FROM users WHERE site = '${this.SITE_ID}'`);
      const siteCount = siteResult[0]?.values[0]?.[0] || 0;
      
      return {
        loaded: this.isLoaded,
        hasDatabase: true,
        userCount: siteCount,
        totalUsers: totalCount,
        site: this.SITE_ID
      };
    } catch (error) {
      return { loaded: this.isLoaded, hasDatabase: !!this.db, userCount: 0, site: this.SITE_ID };
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    SQLDatabase.init();
  }, 100);
});

window.SQLDatabase = SQLDatabase;
