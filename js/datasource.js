/**
 * AIByJob DataSource Manager
 * ===========================
 * Handles multiple data storage backends:
 * - localStorage (default)
 * - Google Forms/Sheets (via CloudDB)
 * - GitHub Gist
 * - GitHub Repo JSON
 */

const DataSourceManager = {
  activeSource: 'localStorage',
  CONFIG_KEY: 'aibyjob_datasource_config',
  
  SOURCES: {
    localStorage: {
      name: 'localStorage',
      label: 'Browser Storage',
      icon: '💾',
      description: 'Data stored in your browser only',
      requiresConfig: false
    },
    googleSheets: {
      name: 'googleSheets',
      label: 'Google Sheets',
      icon: '📊',
      description: 'Sync via Google Forms & Apps Script',
      requiresConfig: true,
      fields: ['formUrl', 'apiUrl']
    },
    githubGist: {
      name: 'githubGist',
      label: 'GitHub Gist',
      icon: '📝',
      description: 'Store data in a GitHub Gist',
      requiresConfig: true,
      fields: ['gistId', 'filename', 'token']
    },
    githubRepo: {
      name: 'githubRepo',
      label: 'GitHub Repo',
      icon: '📁',
      description: 'Store data in a GitHub repository',
      requiresConfig: true,
      fields: ['owner', 'repo', 'path', 'branch', 'token']
    }
  },

  init() {
    this.loadConfig();
    console.log(`[DataSource] Initialized. Active: ${this.activeSource}`);
    return this;
  },

  loadConfig() {
    try {
      const saved = localStorage.getItem(this.CONFIG_KEY);
      if (saved) {
        const config = JSON.parse(saved);
        this.activeSource = config.activeSource || 'localStorage';
        this.configs = config.configs || {};
      } else {
        this.activeSource = 'localStorage';
        this.configs = {};
      }
    } catch (e) {
      console.error('[DataSource] Error loading config:', e);
      this.activeSource = 'localStorage';
      this.configs = {};
    }
  },

  saveConfig() {
    const config = {
      activeSource: this.activeSource,
      configs: this.configs,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
  },

  getConfig(source) {
    return this.configs[source] || {};
  },

  setConfig(source, config) {
    this.configs[source] = config;
    this.saveConfig();
  },

  setActiveSource(source) {
    this.activeSource = source;
    this.saveConfig();
    console.log(`[DataSource] Active source changed to: ${source}`);
  },

  isConfigured(source) {
    const config = this.configs[source];
    if (!config) return false;
    const sourceInfo = this.SOURCES[source];
    if (!sourceInfo.requiresConfig) return true;
    return sourceInfo.fields.some(field => config[field]);
  },

  // Test connection for a datasource
  async testConnection(source, config) {
    try {
      switch (source) {
        case 'localStorage':
          return { success: true, message: 'localStorage is always available' };
          
        case 'googleSheets':
          if (!config.apiUrl) throw new Error('API URL required');
          const gsResp = await fetch(config.apiUrl);
          return gsResp.ok 
            ? { success: true, message: 'Connected to Google Sheets API' }
            : { success: false, message: `Failed: ${gsResp.status}` };
          
        case 'githubGist':
          if (!config.gistId) throw new Error('Gist ID required');
          const gistHeaders = config.token ? { 'Authorization': `token ${config.token}` } : {};
          const gistResp = await fetch(`https://api.github.com/gists/${config.gistId}`, { headers: gistHeaders });
          return gistResp.ok
            ? { success: true, message: 'Connected to GitHub Gist' }
            : { success: false, message: `Failed: ${gistResp.status}` };
          
        case 'githubRepo':
          if (!config.owner || !config.repo) throw new Error('Owner and repo required');
          const repoHeaders = config.token ? { 'Authorization': `token ${config.token}` } : {};
          const repoResp = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, { headers: repoHeaders });
          return repoResp.ok
            ? { success: true, message: 'Connected to GitHub Repository' }
            : { success: false, message: `Failed: ${repoResp.status}` };
          
        default:
          return { success: false, message: 'Unknown datasource' };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // Read data from active datasource
  async read(key) {
    const config = this.configs[this.activeSource] || {};
    
    switch (this.activeSource) {
      case 'localStorage':
        return JSON.parse(localStorage.getItem(key) || 'null');
        
      case 'googleSheets':
        if (!config.apiUrl) return null;
        try {
          const response = await fetch(`${config.apiUrl}?action=get&key=${key}`);
          return await response.json();
        } catch (e) {
          console.error('[DataSource] Google Sheets read error:', e);
          return null;
        }
        
      case 'githubGist':
        if (!config.gistId) return null;
        try {
          const headers = config.token ? { 'Authorization': `token ${config.token}` } : {};
          const response = await fetch(`https://api.github.com/gists/${config.gistId}`, { headers });
          const gist = await response.json();
          const content = gist.files[config.filename || 'data.json']?.content;
          return content ? JSON.parse(content) : null;
        } catch (e) {
          console.error('[DataSource] GitHub Gist read error:', e);
          return null;
        }
        
      case 'githubRepo':
        if (!config.owner || !config.repo) return null;
        try {
          const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch || 'main'}/${config.path || 'data.json'}`;
          const response = await fetch(url);
          return await response.json();
        } catch (e) {
          console.error('[DataSource] GitHub Repo read error:', e);
          return null;
        }
        
      default:
        return null;
    }
  },

  // Write data to active datasource
  async write(key, data) {
    const config = this.configs[this.activeSource] || {};
    
    // Always write to localStorage as backup
    localStorage.setItem(key, JSON.stringify(data));
    
    switch (this.activeSource) {
      case 'localStorage':
        return true;
        
      case 'googleSheets':
        if (!config.formUrl) return false;
        try {
          const formData = new FormData();
          formData.append('entry.0', JSON.stringify({ key, data, timestamp: new Date().toISOString() }));
          await fetch(config.formUrl, { method: 'POST', body: formData, mode: 'no-cors' });
          return true;
        } catch (e) {
          console.error('[DataSource] Google Sheets write error:', e);
          return false;
        }
        
      case 'githubGist':
        if (!config.gistId || !config.token) return false;
        try {
          const filename = config.filename || 'data.json';
          await fetch(`https://api.github.com/gists/${config.gistId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `token ${config.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              files: { [filename]: { content: JSON.stringify(data, null, 2) } }
            })
          });
          return true;
        } catch (e) {
          console.error('[DataSource] GitHub Gist write error:', e);
          return false;
        }
        
      case 'githubRepo':
        if (!config.owner || !config.repo || !config.token) return false;
        try {
          const path = config.path || 'data.json';
          const branch = config.branch || 'main';
          
          // Get current file SHA
          const getUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${branch}`;
          const getResponse = await fetch(getUrl, {
            headers: { 'Authorization': `token ${config.token}` }
          });
          
          let sha = null;
          if (getResponse.ok) {
            const fileInfo = await getResponse.json();
            sha = fileInfo.sha;
          }
          
          // Update or create file
          const body = {
            message: `Update ${path} via AIByJob`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
            branch: branch
          };
          if (sha) body.sha = sha;
          
          await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${config.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
          return true;
        } catch (e) {
          console.error('[DataSource] GitHub Repo write error:', e);
          return false;
        }
        
      default:
        return false;
    }
  },

  // Sync usage data to cloud
  async syncUsageData(usageData) {
    if (this.activeSource === 'localStorage') return false;
    return await this.write('aibyjob_usage', usageData);
  },

  // Render admin panel for datasource configuration
  renderAdminPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const activeInfo = this.SOURCES[this.activeSource];
    
    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <h4 style="color: #fff; margin: 0;">Current Storage</h4>
          <span style="padding: 4px 12px; background: rgba(16,185,129,0.2); color: #10b981; border-radius: 12px; font-size: 0.85rem;">
            ${activeInfo.icon} ${activeInfo.label}
          </span>
        </div>
        <p style="color: #9ca3af; font-size: 0.9rem; margin: 0;">${activeInfo.description}</p>
      </div>
      
      <h4 style="color: #fff; margin-bottom: 16px;">Available Storage Options</h4>
      <div style="display: grid; gap: 12px;">
        ${Object.entries(this.SOURCES).map(([key, source]) => `
          <div style="background: rgba(30,30,40,0.6); border: 1px solid ${this.activeSource === key ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)'}; border-radius: 12px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="font-size: 1.25rem;">${source.icon}</span>
                  <span style="color: #fff; font-weight: 500;">${source.label}</span>
                  ${this.activeSource === key ? '<span style="background: rgba(16,185,129,0.2); color: #10b981; padding: 2px 8px; border-radius: 8px; font-size: 0.75rem;">Active</span>' : ''}
                </div>
                <p style="color: #6b7280; font-size: 0.85rem; margin: 0;">${source.description}</p>
              </div>
              <button onclick="DataSourceManager.showConfigModal('${key}')" style="padding: 8px 16px; background: ${this.activeSource === key ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)'}; color: ${this.activeSource === key ? '#10b981' : '#818cf8'}; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                ${this.activeSource === key ? '✓ Active' : this.isConfigured(key) ? 'Switch' : 'Configure'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 24px; padding: 16px; background: rgba(99,102,241,0.1); border-radius: 8px;">
        <h5 style="color: #818cf8; margin: 0 0 8px 0;">💡 Why use cloud storage?</h5>
        <ul style="color: #9ca3af; font-size: 0.85rem; margin: 0; padding-left: 20px;">
          <li>Track usage across all users</li>
          <li>See which agents are most popular</li>
          <li>Backup data beyond browser storage</li>
          <li>Share analytics across devices</li>
        </ul>
      </div>
    `;
  },

  // Show configuration modal
  showConfigModal(source) {
    const sourceInfo = this.SOURCES[source];
    const config = this.configs[source] || {};
    
    // Remove existing modal
    const existing = document.getElementById('datasource-modal');
    if (existing) existing.remove();
    
    let fieldsHtml = '';
    
    if (source === 'localStorage') {
      fieldsHtml = `<p style="color: #9ca3af;">No configuration needed. Data is stored in your browser.</p>`;
    } else if (source === 'googleSheets') {
      fieldsHtml = `
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">Google Form URL</label>
          <input type="text" id="ds-formUrl" value="${config.formUrl || ''}" placeholder="https://docs.google.com/forms/d/e/.../formResponse" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">Apps Script API URL</label>
          <input type="text" id="ds-apiUrl" value="${config.apiUrl || ''}" placeholder="https://script.google.com/macros/s/.../exec" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
      `;
    } else if (source === 'githubGist') {
      fieldsHtml = `
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">Gist ID</label>
          <input type="text" id="ds-gistId" value="${config.gistId || ''}" placeholder="abc123..." style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">Filename</label>
          <input type="text" id="ds-filename" value="${config.filename || 'aibyjob-data.json'}" placeholder="data.json" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">GitHub Token (with gist scope)</label>
          <input type="password" id="ds-token" value="${config.token || ''}" placeholder="ghp_..." style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
      `;
    } else if (source === 'githubRepo') {
      fieldsHtml = `
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">Repository Owner</label>
          <input type="text" id="ds-owner" value="${config.owner || ''}" placeholder="AIUNITES" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">Repository Name</label>
          <input type="text" id="ds-repo" value="${config.repo || ''}" placeholder="aibyjob-data" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">File Path</label>
          <input type="text" id="ds-path" value="${config.path || 'data/usage.json'}" placeholder="data/usage.json" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">Branch</label>
          <input type="text" id="ds-branch" value="${config.branch || 'main'}" placeholder="main" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: #e5e7eb; margin-bottom: 6px; font-size: 0.9rem;">GitHub Token (with repo scope)</label>
          <input type="password" id="ds-token" value="${config.token || ''}" placeholder="ghp_..." style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; font-size: 0.9rem; box-sizing: border-box;">
        </div>
      `;
    }
    
    const modal = document.createElement('div');
    modal.id = 'datasource-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10002;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = `
      <div style="background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:16px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;">
        <div style="padding:20px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;color:#fff;">${sourceInfo.icon} Configure ${sourceInfo.label}</h3>
          <button onclick="document.getElementById('datasource-modal').remove()" style="background:none;border:none;color:#6b7280;font-size:1.5rem;cursor:pointer;">&times;</button>
        </div>
        <div style="padding:24px;">
          ${fieldsHtml}
          <div id="ds-test-result" style="margin-bottom: 16px;"></div>
          <div style="display:flex;gap:12px;">
            <button onclick="DataSourceManager.testFromModal('${source}')" style="flex:1;padding:12px;background:rgba(99,102,241,0.2);color:#818cf8;border:1px solid rgba(99,102,241,0.3);border-radius:8px;cursor:pointer;">🔄 Test</button>
            <button onclick="DataSourceManager.saveFromModal('${source}')" style="flex:1;padding:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Save & Activate</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  },

  // Test connection from modal
  async testFromModal(source) {
    const config = this.getConfigFromModal(source);
    const resultEl = document.getElementById('ds-test-result');
    
    resultEl.innerHTML = '<span style="color:#06b6d4;">🔄 Testing...</span>';
    
    const result = await this.testConnection(source, config);
    
    resultEl.innerHTML = result.success
      ? `<span style="color:#10b981;">✅ ${result.message}</span>`
      : `<span style="color:#ef4444;">❌ ${result.message}</span>`;
  },

  // Get config values from modal
  getConfigFromModal(source) {
    const config = {};
    
    if (source === 'googleSheets') {
      config.formUrl = document.getElementById('ds-formUrl')?.value.trim() || '';
      config.apiUrl = document.getElementById('ds-apiUrl')?.value.trim() || '';
    } else if (source === 'githubGist') {
      config.gistId = document.getElementById('ds-gistId')?.value.trim() || '';
      config.filename = document.getElementById('ds-filename')?.value.trim() || 'data.json';
      config.token = document.getElementById('ds-token')?.value.trim() || '';
    } else if (source === 'githubRepo') {
      config.owner = document.getElementById('ds-owner')?.value.trim() || '';
      config.repo = document.getElementById('ds-repo')?.value.trim() || '';
      config.path = document.getElementById('ds-path')?.value.trim() || 'data.json';
      config.branch = document.getElementById('ds-branch')?.value.trim() || 'main';
      config.token = document.getElementById('ds-token')?.value.trim() || '';
    }
    
    return config;
  },

  // Save config from modal
  saveFromModal(source) {
    const config = this.getConfigFromModal(source);
    this.setConfig(source, config);
    this.setActiveSource(source);
    
    document.getElementById('datasource-modal')?.remove();
    
    // Refresh admin panel if visible
    const adminPanel = document.getElementById('clouddb-admin-panel');
    if (adminPanel) this.renderAdminPanel('clouddb-admin-panel');
    
    // Show toast
    if (typeof showToast === 'function') {
      showToast(`${this.SOURCES[source].icon} ${this.SOURCES[source].label} activated!`, 'success');
    }
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  DataSourceManager.init();
});

window.DataSourceManager = DataSourceManager;
