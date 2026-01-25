/**
 * AIByJob SQL Database Manager
 * ============================
 * Browser-based SQLite database using sql.js
 * - Create/manage databases
 * - Run SQL queries
 * - Import/export .db files
 * - Auto-save to localStorage
 * - GitHub sync for shared database
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
  
  // Database location types
  LOCATIONS: {
    browser: { name: 'Browser', icon: '💻', requiresConfig: false },
    githubSync: { name: 'GitHub Sync', icon: '🐙', requiresConfig: true }
  },
  
  /**
   * Set GitHub token
   */
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
    }
  },
  
  hasGitHubToken() {
    return !!localStorage.getItem('github_token') || 
           !!(this.locationConfig.githubSync && this.locationConfig.githubSync.token);
  },
  
  getGitHubToken() {
    return localStorage.getItem('github_token') || 
           (this.locationConfig.githubSync && this.locationConfig.githubSync.token) || '';
  },
  
  /**
   * Initialize sql.js and load saved database
   */
  async init() {
    try {
      // Load sql.js WebAssembly
      this.SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
      });
      
      console.log('[SQLDatabase] sql.js loaded successfully');
      
      // Load location config
      this.loadLocationConfig();
      
      // Try to load saved database from localStorage
      await this.loadFromStorage();
      
      // If no local database and not on localhost, auto-load from GitHub
      if (!this.isLoaded && !this.isLocalhost()) {
        console.log('[SQLDatabase] No local database found, attempting auto-load from GitHub...');
        const loaded = await this.autoLoadFromGitHub();
        if (loaded) {
          console.log('[SQLDatabase] Successfully auto-loaded database from GitHub');
        }
      }
      
      // Load query history
      this.loadHistory();
      
      // Bind UI events
      this.bindEvents();
      
      // Update UI
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
    return host === 'localhost' || host === '127.0.0.1' || protocol === 'file:';
  },
  
  /**
   * Auto-load database from GitHub
   */
  async autoLoadFromGitHub() {
    try {
      const config = (this.locationConfig.githubSync && this.locationConfig.githubSync.owner) 
        ? this.locationConfig.githubSync 
        : this.DEFAULT_GITHUB_CONFIG;
      
      const path = config.path || 'data/app.db';
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
      
      console.log('[SQLDatabase] Auto-loading from:', apiUrl);
      
      const headers = {};
      if (config.token) headers['Authorization'] = `token ${config.token}`;
      
      const resp = await fetch(apiUrl, { headers });
      
      if (!resp.ok) {
        console.log('[SQLDatabase] GitHub API returned:', resp.status);
        return false;
      }
      
      const data = await resp.json();
      
      // Decode base64 content
      const binary = atob(data.content.replace(/\n/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      // Load into sql.js
      this.db = new this.SQL.Database(bytes);
      this.isLoaded = true;
      this.location = 'githubSync';
      
      console.log('[SQLDatabase] Auto-loaded from GitHub successfully!');
      
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
      } else {
        card.classList.remove('active');
      }
    });
  },
  
  configureLocation(locationType) {
    const config = this.locationConfig[locationType] || this.DEFAULT_GITHUB_CONFIG;
    
    const modal = document.createElement('div');
    modal.id = 'db-location-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10002;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = `
      <div style="background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:16px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;">
        <div style="padding:20px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;color:#fff;">🐙 Configure GitHub Sync</h3>
          <button onclick="document.getElementById('db-location-modal').remove()" style="background:none;border:none;color:#6b7280;font-size:1.5rem;cursor:pointer;">&times;</button>
        </div>
        <div style="padding:24px;">
          <p style="color:#9ca3af;margin-bottom:20px;">Sync your SQLite database to a GitHub repository. All AIUNITES sites can access it.</p>
          
          <div style="margin-bottom:16px;">
            <label style="display:block;color:#e5e7eb;margin-bottom:6px;font-size:0.9rem;">Repository Owner</label>
            <input type="text" id="gh-sync-owner" value="${config.owner || 'AIUNITES'}" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.9rem;box-sizing:border-box;">
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block;color:#e5e7eb;margin-bottom:6px;font-size:0.9rem;">Repository Name</label>
            <input type="text" id="gh-sync-repo" value="${config.repo || 'AIUNITES-database-sync'}" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.9rem;box-sizing:border-box;">
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block;color:#e5e7eb;margin-bottom:6px;font-size:0.9rem;">File Path</label>
            <input type="text" id="gh-sync-path" value="${config.path || 'data/app.db'}" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.9rem;box-sizing:border-box;">
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block;color:#e5e7eb;margin-bottom:6px;font-size:0.9rem;">GitHub Token (needs repo write access)</label>
            <input type="password" id="gh-sync-token" value="${config.token || ''}" placeholder="ghp_xxxxxxxxxxxx" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.9rem;box-sizing:border-box;">
            <span style="color:#6b7280;font-size:0.8rem;">Required for saving to GitHub</span>
          </div>
          
          <div id="gh-test-result" style="margin-bottom:16px;"></div>
          
          <div style="display:flex;gap:12px;">
            <button onclick="SQLDatabase.testGitHubConnection()" style="flex:1;padding:12px;background:rgba(99,102,241,0.2);color:#818cf8;border:1px solid rgba(99,102,241,0.3);border-radius:8px;cursor:pointer;">🔄 Test</button>
            <button onclick="SQLDatabase.saveGitHubConfig()" style="flex:1;padding:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Save & Activate</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  },
  
  async testGitHubConnection() {
    const resultEl = document.getElementById('gh-test-result');
    resultEl.innerHTML = '<span style="color:#06b6d4;">🔄 Testing...</span>';
    
    const owner = document.getElementById('gh-sync-owner').value.trim();
    const repo = document.getElementById('gh-sync-repo').value.trim();
    const token = document.getElementById('gh-sync-token').value.trim();
    
    try {
      const headers = token ? { 'Authorization': `token ${token}` } : {};
      const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      
      if (resp.ok) {
        resultEl.innerHTML = '<span style="color:#10b981;">✅ Connected to GitHub repository</span>';
      } else {
        resultEl.innerHTML = `<span style="color:#ef4444;">❌ Failed: ${resp.status}</span>`;
      }
    } catch (e) {
      resultEl.innerHTML = `<span style="color:#ef4444;">❌ Error: ${e.message}</span>`;
    }
  },
  
  saveGitHubConfig() {
    const config = {
      owner: document.getElementById('gh-sync-owner').value.trim(),
      repo: document.getElementById('gh-sync-repo').value.trim(),
      path: document.getElementById('gh-sync-path').value.trim() || 'data/app.db',
      token: document.getElementById('gh-sync-token').value.trim()
    };
    
    this.locationConfig.githubSync = config;
    this.location = 'githubSync';
    this.saveLocationConfig();
    this.updateLocationUI();
    
    document.getElementById('db-location-modal')?.remove();
    
    if (typeof showToast === 'function') {
      showToast('🐙 GitHub Sync configured!', 'success');
    }
  },
  
  bindEvents() {
    // Browser card click
    document.querySelector('.db-location-card[data-location="browser"]')?.addEventListener('click', () => {
      this.location = 'browser';
      this.saveLocationConfig();
      this.updateLocationUI();
      if (typeof showToast === 'function') showToast('💻 Browser storage active', 'success');
    });
    
    // New Database
    document.getElementById('sql-new-db-btn')?.addEventListener('click', () => this.createNewDatabase());
    
    // Load .db file
    document.getElementById('sql-load-file')?.addEventListener('change', (e) => this.loadFromFile(e.target.files[0]));
    
    // Save database to file
    document.getElementById('sql-save-db-btn')?.addEventListener('click', () => this.saveToFile());
    
    // Save to GitHub
    document.getElementById('sql-save-github-btn')?.addEventListener('click', () => this.saveToGitHub());
    
    // Load from GitHub
    document.getElementById('sql-load-github-btn')?.addEventListener('click', () => this.loadFromGitHub());
    
    // Run query
    document.getElementById('sql-run-btn')?.addEventListener('click', () => this.runQuery());
    
    // Clear query
    document.getElementById('sql-clear-btn')?.addEventListener('click', () => {
      document.getElementById('sql-query-input').value = '';
    });
    
    // Example queries
    document.getElementById('sql-examples-select')?.addEventListener('change', (e) => {
      this.insertExampleQuery(e.target.value);
      e.target.value = '';
    });
    
    // Refresh tables
    document.getElementById('sql-refresh-tables-btn')?.addEventListener('click', () => this.refreshTables());
    
    // Create table
    document.getElementById('sql-create-table-btn')?.addEventListener('click', () => this.showCreateTableDialog());
    
    // Clear history
    document.getElementById('sql-clear-history-btn')?.addEventListener('click', () => this.clearHistory());
    
    // Keyboard shortcut: Ctrl+Enter to run query
    document.getElementById('sql-query-input')?.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runQuery();
      }
    });
  },
  
  createNewDatabase() {
    if (this.db && !confirm('This will replace the current database. Continue?')) return;
    
    this.db = new this.SQL.Database();
    this.isLoaded = true;
    
    this.updateStatus('New database created', 'success');
    this.refreshTables();
    this.autoSave();
    
    const saveBtn = document.getElementById('sql-save-db-btn');
    if (saveBtn) saveBtn.disabled = false;
    
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
      
      const saveBtn = document.getElementById('sql-save-db-btn');
      if (saveBtn) saveBtn.disabled = false;
      
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
      
      if (typeof showToast === 'function') showToast('💾 Database saved to file', 'success');
    } catch (error) {
      console.error('[SQLDatabase] Save error:', error);
      alert('Error saving database');
    }
  },
  
  async saveToGitHub() {
    if (!this.db) {
      alert('No database to save');
      return false;
    }
    
    let token = this.getGitHubToken();
    
    if (!token) {
      token = prompt('Enter your GitHub Personal Access Token (needs repo write access):');
      if (!token) {
        if (typeof showToast === 'function') showToast('GitHub token required', 'error');
        return false;
      }
      if (confirm('Save token for future use?')) {
        this.setGitHubToken(token);
      }
    }
    
    try {
      const config = this.locationConfig.githubSync || this.DEFAULT_GITHUB_CONFIG;
      const path = config.path || 'data/app.db';
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
      
      if (typeof showToast === 'function') showToast('Saving to GitHub...', 'info');
      
      // Get current file SHA
      let sha = null;
      try {
        const existingResp = await fetch(apiUrl, { headers: { 'Authorization': `token ${token}` } });
        if (existingResp.ok) {
          const existing = await existingResp.json();
          sha = existing.sha;
        }
      } catch (e) {}
      
      // Export database to base64
      const data = this.db.export();
      const base64 = btoa(String.fromCharCode.apply(null, data));
      
      // Create or update file
      const body = {
        message: `Update database from ${this.SITE_ID} - ${new Date().toISOString()}`,
        content: base64,
        branch: config.branch || 'main'
      };
      if (sha) body.sha = sha;
      
      const resp = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (resp.ok) {
        if (typeof showToast === 'function') showToast('🐙 Database saved to GitHub!', 'success');
        return true;
      } else {
        const error = await resp.json();
        throw new Error(error.message || 'GitHub API error');
      }
    } catch (error) {
      console.error('[SQLDatabase] GitHub save error:', error);
      if (typeof showToast === 'function') showToast('Error: ' + error.message, 'error');
      return false;
    }
  },
  
  async loadFromGitHub() {
    let config = this.locationConfig.githubSync;
    if (!config || !config.owner) {
      config = this.DEFAULT_GITHUB_CONFIG;
    }
    
    try {
      const path = config.path || 'data/app.db';
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
      
      const headers = {};
      if (config.token) headers['Authorization'] = `token ${config.token}`;
      
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
      
      const saveBtn = document.getElementById('sql-save-db-btn');
      if (saveBtn) saveBtn.disabled = false;
      
      if (typeof showToast === 'function') showToast('🐙 Database loaded from GitHub!', 'success');
      
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
      
      const saveBtn = document.getElementById('sql-save-db-btn');
      if (saveBtn) saveBtn.disabled = false;
      
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
    
    if (!this.db) this.createNewDatabase();
    
    const startTime = performance.now();
    
    try {
      const results = this.db.exec(query);
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      
      document.getElementById('sql-query-time').textContent = `${duration}ms`;
      
      this.displayResults(results);
      this.addToHistory(query, true);
      
      if (this.isSchemaChange(query)) this.refreshTables();
      
      this.autoSave();
      
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
      container.innerHTML = '<div style="color:#10b981;padding:20px;">✅ Query executed successfully (no results)</div>';
      countEl.textContent = '';
      return;
    }
    
    let html = '';
    let totalRows = 0;
    
    results.forEach((result) => {
      const { columns, values } = result;
      totalRows += values.length;
      
      html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;">';
      html += '<thead><tr>';
      columns.forEach(col => {
        html += `<th style="padding:8px 12px;background:rgba(99,102,241,0.2);color:#818cf8;text-align:left;border:1px solid rgba(255,255,255,0.1);">${this.escapeHtml(col)}</th>`;
      });
      html += '</tr></thead><tbody>';
      
      values.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
          const displayValue = cell === null ? '<span style="color:#6b7280;">NULL</span>' : this.escapeHtml(String(cell));
          html += `<td style="padding:8px 12px;border:1px solid rgba(255,255,255,0.1);color:#e5e7eb;">${displayValue}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    });
    
    container.innerHTML = html;
    countEl.textContent = `${totalRows} row${totalRows !== 1 ? 's' : ''}`;
  },
  
  displayError(message) {
    const container = document.getElementById('sql-results-container');
    container.innerHTML = `<div style="color:#ef4444;padding:20px;">❌ Error: ${this.escapeHtml(message)}</div>`;
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
      container.innerHTML = '<div style="color:#6b7280;padding:12px;text-align:center;">No database loaded</div>';
      return;
    }
    
    try {
      const result = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
      
      if (!result.length || !result[0].values.length) {
        container.innerHTML = '<div style="color:#6b7280;padding:12px;text-align:center;">No tables yet</div>';
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
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(30,30,40,0.6);border-radius:6px;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span>📋</span>
              <span style="color:#fff;">${this.escapeHtml(tableName)}</span>
              <span style="color:#6b7280;font-size:0.8rem;">${rowCount} rows</span>
            </div>
            <div style="display:flex;gap:4px;">
              <button onclick="SQLDatabase.selectAll('${tableName}')" style="padding:4px 8px;background:rgba(99,102,241,0.2);border:none;border-radius:4px;color:#818cf8;cursor:pointer;font-size:0.75rem;">SELECT</button>
              <button onclick="SQLDatabase.dropTable('${tableName}')" style="padding:4px 8px;background:rgba(239,68,68,0.1);border:none;border-radius:4px;color:#ef4444;cursor:pointer;font-size:0.75rem;">DROP</button>
            </div>
          </div>
        `;
      });
      
      container.innerHTML = html;
      
    } catch (error) {
      container.innerHTML = '<div style="color:#6b7280;padding:12px;text-align:center;">Error loading tables</div>';
    }
  },
  
  selectAll(tableName) {
    document.getElementById('sql-query-input').value = `SELECT * FROM "${tableName}" LIMIT 100;`;
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
      select: 'SELECT * FROM users WHERE site = "AIByJob" LIMIT 10;',
      create: `CREATE TABLE users (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  username TEXT UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  display_name TEXT,\n  email TEXT,\n  role TEXT DEFAULT 'user',\n  site TEXT DEFAULT 'AIByJob',\n  created_at TEXT DEFAULT CURRENT_TIMESTAMP\n);`,
      insert: `INSERT INTO users (username, password_hash, display_name, email, site) VALUES \n  ('demo', 'demo123', 'Demo User', 'demo@aibyjob.com', 'AIByJob');`,
      update: `UPDATE users SET display_name = 'Updated Name' WHERE id = 1;`,
      delete: `DELETE FROM users WHERE id = 1;`,
      drop: 'DROP TABLE IF EXISTS table_name;'
    };
    
    if (examples[type]) {
      document.getElementById('sql-query-input').value = examples[type];
    }
  },
  
  addToHistory(query, success, error = null) {
    this.history.unshift({ query, success, error, timestamp: new Date().toISOString() });
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
      container.innerHTML = '<div style="color:#6b7280;padding:12px;text-align:center;">No queries yet</div>';
      return;
    }
    
    let html = '';
    this.history.slice(0, 10).forEach((item, idx) => {
      const icon = item.success ? '✅' : '❌';
      const shortQuery = item.query.substring(0, 40) + (item.query.length > 40 ? '...' : '');
      
      html += `
        <div onclick="SQLDatabase.useHistoryItem(${idx})" style="padding:8px;background:rgba(30,30,40,0.6);border-radius:4px;margin-bottom:4px;cursor:pointer;display:flex;align-items:center;gap:8px;">
          <span>${icon}</span>
          <span style="color:#9ca3af;font-size:0.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.escapeHtml(shortQuery)}</span>
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
      textEl.textContent = this.location === 'githubSync' ? 'Database ready (Loaded from GitHub)' : 'Database ready';
    } else {
      textEl.textContent = 'Database not loaded';
    }
    
    switch (type) {
      case 'success': iconEl.textContent = '🟢'; break;
      case 'error': iconEl.textContent = '🔴'; break;
      default: iconEl.textContent = this.isLoaded ? '🟢' : '⚪';
    }
  },
  
  // ========== PASSWORD HASHING ==========
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
  
  // ========== USER METHODS ==========
  ensureUsersTable() {
    if (!this.db) return;
    
    try {
      const tableExists = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
      
      if (!tableExists.length) {
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
        if (!isValid) return null;
        
        this.db.run(`UPDATE users SET last_login = datetime('now') WHERE id = ?`, [row.id]);
        this.autoSave();
        
        return {
          id: row.id,
          username: row.username,
          displayName: row.display_name,
          email: row.email,
          role: row.role,
          createdAt: row.created_at,
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
          site: row.site
        };
      }
      stmt.free();
      return null;
    } catch (error) {
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
      return this.getUserByUsername(userData.username);
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
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
          site: user.site
        };
      });
    } catch (error) {
      return [];
    }
  },
  
  getSiteStatus() {
    if (!this.db) return { loaded: false, hasDatabase: false, userCount: 0, site: this.SITE_ID };
    
    try {
      const siteResult = this.db.exec(`SELECT COUNT(*) FROM users WHERE site = '${this.SITE_ID}'`);
      const siteCount = siteResult[0]?.values[0]?.[0] || 0;
      
      return {
        loaded: this.isLoaded,
        hasDatabase: true,
        userCount: siteCount,
        site: this.SITE_ID,
        location: this.location
      };
    } catch (error) {
      return { loaded: this.isLoaded, hasDatabase: !!this.db, userCount: 0, site: this.SITE_ID };
    }
  }
};

// Export for global access
window.SQLDatabase = SQLDatabase;
