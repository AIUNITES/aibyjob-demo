/**
 * Agent Chain Visualizer - Working Version
 * Interactive animated chains with real outputs
 * AIByJob - AIUNITES Network
 */

const ChainVisualizer = {
  // Working chain configurations
  chains: {
    'social-blitz': {
      name: '📱 Social Media Blitz',
      description: 'One input → LinkedIn + Twitter + Facebook posts',
      agents: [
        { id: 'input', icon: '📝', name: 'Input', color: '#f59e0b', action: 'Processing brief...' },
        { id: 'linkedin', icon: '🔗', name: 'LinkedIn', color: '#0077b5', action: 'Crafting professional post...' },
        { id: 'twitter', icon: '🐦', name: 'Twitter', color: '#1da1f2', action: 'Optimizing for engagement...' },
        { id: 'facebook', icon: '📘', name: 'Facebook', color: '#4267b2', action: 'Creating shareable post...' }
      ],
      inputs: [
        { id: 'productName', label: 'Product/Company Name', type: 'text', placeholder: 'e.g., AIByJob' },
        { id: 'description', label: 'Description', type: 'textarea', placeholder: 'What does it do?' },
        { id: 'features', label: 'Key Features (one per line)', type: 'textarea', placeholder: 'Feature 1\nFeature 2\nFeature 3' },
        { id: 'tone', label: 'Tone', type: 'select', options: ['professional', 'casual', 'excited'] }
      ],
      runner: 'runSocialMediaBlitz'
    },
    'site-launcher': {
      name: '🚀 AIUNITES Site Launcher',
      description: 'Generate full social kit for any AIUNITES site',
      agents: [
        { id: 'extract', icon: '📊', name: 'Extract', color: '#8b5cf6', action: 'Extracting site data...' },
        { id: 'linkedin', icon: '🔗', name: 'LinkedIn', color: '#0077b5', action: 'Creating announcement...' },
        { id: 'twitter', icon: '🐦', name: 'Twitter', color: '#1da1f2', action: 'Writing thread...' },
        { id: 'facebook', icon: '📘', name: 'Facebook', color: '#4267b2', action: 'Crafting post...' },
        { id: 'presskit', icon: '📰', name: 'Press Kit', color: '#10b981', action: 'Compiling press kit...' }
      ],
      inputs: [
        { id: 'siteName', label: 'Select AIUNITES Site', type: 'select', options: ['AIUNITES', 'AIByJob', 'AIZines', 'Redomy', 'VideoBate', 'Gameatica', 'FurnishThings', 'BizStry', 'Cloudsion', 'UptownIT', 'ERPise', 'ERPize'] }
      ],
      runner: 'runSiteLauncher'
    },
    'lead-email': {
      name: '📧 Lead-to-Email Pipeline',
      description: 'Find leads → Score → Generate personalized emails',
      agents: [
        { id: 'scan', icon: '🔍', name: 'Scan', color: '#06b6d4', action: 'Scanning directories...' },
        { id: 'score', icon: '📊', name: 'Score', color: '#f59e0b', action: 'Ranking leads...' },
        { id: 'emails', icon: '✍️', name: 'Write', color: '#8b5cf6', action: 'Generating emails...' },
        { id: 'export', icon: '📤', name: 'Export', color: '#10b981', action: 'Preparing export...' }
      ],
      inputs: [
        { id: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Austin, TX' },
        { id: 'industry', label: 'Industry', type: 'select', options: ['restaurants', 'retail', 'beauty', 'services'] },
        { id: 'emailTone', label: 'Email Tone', type: 'select', options: ['friendly', 'professional', 'casual'] }
      ],
      runner: 'runLeadToEmail'
    },
    'content-repurpose': {
      name: '♻️ Content Repurposer',
      description: 'Article → Summary + LinkedIn + Twitter + Newsletter',
      agents: [
        { id: 'analyze', icon: '🔍', name: 'Analyze', color: '#8b5cf6', action: 'Analyzing content...' },
        { id: 'summarize', icon: '📝', name: 'Summarize', color: '#f59e0b', action: 'Creating summary...' },
        { id: 'linkedin', icon: '🔗', name: 'LinkedIn', color: '#0077b5', action: 'Formatting post...' },
        { id: 'twitter', icon: '🐦', name: 'Twitter', color: '#1da1f2', action: 'Creating thread...' },
        { id: 'newsletter', icon: '📰', name: 'Newsletter', color: '#10b981', action: 'Drafting snippet...' }
      ],
      inputs: [
        { id: 'originalContent', label: 'Paste your content', type: 'textarea', placeholder: 'Paste your blog post, article, or any content here...', rows: 6 },
        { id: 'contentType', label: 'Content Type', type: 'text', placeholder: 'e.g., blog post, article, report' }
      ],
      runner: 'runContentRepurposer'
    },
    'launch-kit': {
      name: '🎯 Product Launch Kit',
      description: 'Brief → Landing + Social + Press + Email',
      agents: [
        { id: 'brief', icon: '📋', name: 'Brief', color: '#f59e0b', action: 'Processing brief...' },
        { id: 'landing', icon: '🏠', name: 'Landing', color: '#8b5cf6', action: 'Writing copy...' },
        { id: 'social', icon: '📱', name: 'Social', color: '#1da1f2', action: 'Creating posts...' },
        { id: 'press', icon: '📰', name: 'Press', color: '#10b981', action: 'Writing release...' },
        { id: 'email', icon: '📧', name: 'Email', color: '#ef4444', action: 'Drafting campaign...' },
        { id: 'checklist', icon: '✅', name: 'Checklist', color: '#06b6d4', action: 'Creating checklist...' }
      ],
      inputs: [
        { id: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g., SuperApp Pro' },
        { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g., Work smarter, not harder' },
        { id: 'description', label: 'Description', type: 'textarea', placeholder: 'What problem does it solve?' },
        { id: 'features', label: 'Features (one per line)', type: 'textarea', placeholder: 'Feature 1\nFeature 2\nFeature 3' },
        { id: 'targetAudience', label: 'Target Audience', type: 'text', placeholder: 'e.g., Small business owners' },
        { id: 'price', label: 'Price (optional)', type: 'text', placeholder: 'e.g., $29/month' }
      ],
      runner: 'runProductLaunchKit'
    },
    'gmaps-scanner': {
      name: '🗺️ Google Maps No-Website',
      description: 'Find businesses without websites on Google Maps',
      agents: [
        { id: 'search', icon: '🔍', name: 'Search Maps', color: '#4285f4', action: 'Searching Google Maps...' },
        { id: 'filter', icon: '🌐', name: 'Check Sites', color: '#ea4335', action: 'Checking for websites...' },
        { id: 'analyze', icon: '📊', name: 'Analyze', color: '#fbbc05', action: 'Scoring opportunities...' },
        { id: 'enrich', icon: '📞', name: 'Enrich', color: '#34a853', action: 'Getting contact info...' },
        { id: 'report', icon: '📋', name: 'Report', color: '#8b5cf6', action: 'Generating report...' }
      ],
      inputs: [
        { id: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Austin, TX or 78701' },
        { id: 'industry', label: 'Industry', type: 'select', options: ['restaurants', 'retail', 'beauty', 'services'] },
        { id: 'resultCount', label: 'Max Results', type: 'select', options: ['10', '15', '25', '50'] }
      ],
      runner: 'runGoogleMapsScanner'
    },
    'ecom-scanner': {
      name: '🛒 Retail No-Ecommerce',
      description: 'Find shops without online stores',
      agents: [
        { id: 'search', icon: '🔍', name: 'Scan Retail', color: '#8b5cf6', action: 'Scanning retail directories...' },
        { id: 'check', icon: '🛍️', name: 'Check Ecom', color: '#ec4899', action: 'Checking for online stores...' },
        { id: 'analyze', icon: '📈', name: 'Analyze', color: '#f59e0b', action: 'Calculating potential...' },
        { id: 'proposal', icon: '📝', name: 'Proposals', color: '#10b981', action: 'Generating proposals...' },
        { id: 'report', icon: '📊', name: 'Report', color: '#06b6d4', action: 'Compiling report...' }
      ],
      inputs: [
        { id: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Denver, CO' },
        { id: 'storeType', label: 'Store Type', type: 'select', options: ['boutique', 'gifts', 'specialty', 'crafts', 'jewelry', 'home'] },
        { id: 'resultCount', label: 'Max Results', type: 'select', options: ['10', '15', '25', '50'] }
      ],
      runner: 'runEcommerceScanner'
    }
  },

  isRunning: false,
  currentChain: 'social-blitz',
  currentResults: null,

  /**
   * Render the chain visualizer
   */
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="chain-visualizer">
        <!-- Chain Selector -->
        <div class="chain-selector">
          <h4>🔗 Select Agent Chain</h4>
          <div class="chain-buttons">
            ${Object.entries(this.chains).map(([key, chain]) => `
              <button class="chain-select-btn ${key === this.currentChain ? 'active' : ''}" data-chain="${key}">
                <span class="chain-btn-name">${chain.name}</span>
                <span class="chain-btn-desc">${chain.description}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="chain-workspace">
          <!-- Left: Input Form -->
          <div class="chain-input-panel">
            <h4>⚡ Input</h4>
            <form id="chain-input-form" class="chain-form">
              ${this.renderInputForm(this.currentChain)}
            </form>
            <button class="btn-run-chain" id="run-chain-btn">
              <span class="run-icon">▶️</span>
              <span>Run Chain</span>
            </button>
          </div>

          <!-- Right: Visual Flow -->
          <div class="chain-visual-panel">
            <div class="chain-display" id="chain-display">
              ${this.renderChain(this.currentChain)}
            </div>
          </div>
        </div>

        <!-- Output Log -->
        <div class="chain-output">
          <div class="output-header">
            <span>📋 Output Log</span>
            <span class="output-status" id="chain-status">Ready</span>
          </div>
          <div class="output-log" id="chain-output-log">
            <div class="output-line dim">Configure inputs and click "Run Chain"...</div>
          </div>
        </div>

        <!-- Results Panel (hidden until complete) -->
        <div class="chain-results" id="chain-results" style="display: none;">
          <div class="results-header">
            <h4>📦 Generated Content</h4>
            <button class="btn-copy-all" id="copy-all-btn">📋 Copy All</button>
          </div>
          <div class="results-tabs" id="results-tabs"></div>
          <div class="results-content" id="results-content"></div>
        </div>
      </div>
    `;

    this.attachEvents(containerId);
  },

  /**
   * Render input form for a chain
   */
  renderInputForm(chainKey) {
    const chain = this.chains[chainKey];
    if (!chain) return '';

    return chain.inputs.map(input => {
      if (input.type === 'select') {
        return `
          <div class="form-group">
            <label>${input.label}</label>
            <select id="chain-${input.id}" class="form-select">
              ${input.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
        `;
      } else if (input.type === 'textarea') {
        return `
          <div class="form-group">
            <label>${input.label}</label>
            <textarea id="chain-${input.id}" class="form-textarea" placeholder="${input.placeholder || ''}" rows="${input.rows || 3}"></textarea>
          </div>
        `;
      } else {
        return `
          <div class="form-group">
            <label>${input.label}</label>
            <input type="${input.type}" id="chain-${input.id}" class="form-input" placeholder="${input.placeholder || ''}">
          </div>
        `;
      }
    }).join('');
  },

  /**
   * Render chain visual flow
   */
  renderChain(chainKey) {
    const chain = this.chains[chainKey];
    if (!chain) return '';

    return `
      <div class="chain-flow" data-chain="${chainKey}">
        ${chain.agents.map((agent, index) => `
          <div class="chain-agent" data-agent="${agent.id}" style="--agent-color: ${agent.color}">
            <div class="agent-node">
              <div class="agent-pulse"></div>
              <div class="agent-icon">${agent.icon}</div>
              <div class="agent-status-ring"></div>
            </div>
            <div class="agent-label">${agent.name}</div>
            <div class="agent-action">${agent.action}</div>
            <div class="agent-progress">
              <div class="progress-fill"></div>
            </div>
          </div>
          ${index < chain.agents.length - 1 ? `
            <div class="chain-connector">
              <div class="connector-line"></div>
              <div class="connector-arrow">→</div>
              <div class="data-packet" data-packet="${index}">
                <span class="packet-item packet-1">📄</span>
                <span class="packet-item packet-2">📊</span>
                <span class="packet-item packet-3">📋</span>
                <span class="packet-item packet-4">💾</span>
                <span class="packet-item packet-5">📁</span>
              </div>
            </div>
          ` : ''}
        `).join('')}
      </div>
    `;
  },

  /**
   * Attach event listeners
   */
  attachEvents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Chain selector
    container.querySelectorAll('.chain-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isRunning) return;
        
        container.querySelectorAll('.chain-select-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.currentChain = btn.dataset.chain;
        document.getElementById('chain-display').innerHTML = this.renderChain(this.currentChain);
        document.getElementById('chain-input-form').innerHTML = this.renderInputForm(this.currentChain);
        document.getElementById('chain-results').style.display = 'none';
        document.getElementById('chain-output-log').innerHTML = '<div class="output-line dim">Configure inputs and click "Run Chain"...</div>';
        document.getElementById('chain-status').textContent = 'Ready';
        document.getElementById('chain-status').className = 'output-status';
      });
    });

    // Run button
    document.getElementById('run-chain-btn').addEventListener('click', () => {
      if (!this.isRunning) {
        this.runChain();
      }
    });

    // Copy all button
    document.getElementById('copy-all-btn').addEventListener('click', () => {
      this.copyAllResults();
    });
  },

  /**
   * Collect form inputs
   */
  collectInputs() {
    const chain = this.chains[this.currentChain];
    const inputs = {};
    
    chain.inputs.forEach(input => {
      const el = document.getElementById(`chain-${input.id}`);
      if (el) {
        let value = el.value;
        // Convert features to array
        if (input.id === 'features' && value) {
          value = value.split('\n').filter(f => f.trim());
        }
        inputs[input.id] = value;
      }
    });
    
    return inputs;
  },

  /**
   * Run the selected chain
   */
  async runChain() {
    if (this.isRunning) return;
    
    const chain = this.chains[this.currentChain];
    const inputs = this.collectInputs();
    
    // Validate required inputs
    const firstInput = chain.inputs[0];
    if (!inputs[firstInput.id]) {
      alert(`Please fill in: ${firstInput.label}`);
      return;
    }

    this.isRunning = true;
    
    const runBtn = document.getElementById('run-chain-btn');
    const status = document.getElementById('chain-status');
    const log = document.getElementById('chain-output-log');
    const resultsPanel = document.getElementById('chain-results');

    // Reset UI
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="run-icon spinning">⚙️</span><span>Running...</span>';
    status.textContent = 'Running';
    status.className = 'output-status running';
    log.innerHTML = '';
    resultsPanel.style.display = 'none';
    
    // Reset agent states
    document.querySelectorAll('.chain-agent').forEach(el => {
      el.classList.remove('active', 'complete');
      const progress = el.querySelector('.progress-fill');
      if (progress) progress.style.width = '0%';
    });

    this.addLogLine(log, `🚀 Starting ${chain.name}...`, 'info');

    // Progress callback
    const onProgress = (agentId, state, message) => {
      const agentEl = document.querySelector(`.chain-agent[data-agent="${agentId}"]`);
      
      if (state === 'active' && agentEl) {
        agentEl.classList.add('active');
        this.addLogLine(log, message, 'processing');
        this.animateProgress(agentEl.querySelector('.progress-fill'), 800);
      } else if (state === 'complete' && agentEl) {
        agentEl.classList.remove('active');
        agentEl.classList.add('complete');
        this.addLogLine(log, `✓ ${message}`, 'success');
        
        // Animate packet
        const agents = chain.agents;
        const idx = agents.findIndex(a => a.id === agentId);
        if (idx >= 0 && idx < agents.length - 1) {
          const packet = document.querySelector(`.data-packet[data-packet="${idx}"]`);
          if (packet) {
            packet.classList.add('moving');
            setTimeout(() => packet.classList.remove('moving'), 1000);
          }
        }
      }
    };

    try {
      // Run the chain
      const results = await ChainRunner[chain.runner](inputs, onProgress);
      
      // Complete
      status.textContent = 'Complete ✓';
      status.className = 'output-status complete';
      this.addLogLine(log, '✅ Chain completed successfully!', 'complete');
      
      // Show results
      this.currentResults = results;
      this.showResults(results);
      
    } catch (error) {
      status.textContent = 'Error';
      status.className = 'output-status error';
      this.addLogLine(log, `❌ Error: ${error.message}`, 'error');
    }

    runBtn.disabled = false;
    runBtn.innerHTML = '<span class="run-icon">🔄</span><span>Run Again</span>';
    this.isRunning = false;
  },

  /**
   * Show results in tabbed interface
   */
  showResults(results) {
    const resultsPanel = document.getElementById('chain-results');
    const tabsContainer = document.getElementById('results-tabs');
    const contentContainer = document.getElementById('results-content');
    
    // Build tabs based on results
    const tabs = this.getResultTabs(results);
    
    tabsContainer.innerHTML = tabs.map((tab, i) => 
      `<button class="result-tab ${i === 0 ? 'active' : ''}" data-tab="${tab.key}">${tab.icon} ${tab.label}</button>`
    ).join('');
    
    // Show first tab content
    if (tabs.length > 0) {
      contentContainer.innerHTML = this.renderResultContent(tabs[0].key, results);
    }
    
    // Tab click events
    tabsContainer.querySelectorAll('.result-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.result-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        contentContainer.innerHTML = this.renderResultContent(tab.dataset.tab, results);
        
        // Attach copy buttons
        contentContainer.querySelectorAll('.copy-section-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const content = btn.dataset.content;
            navigator.clipboard.writeText(content);
            btn.textContent = '✓ Copied!';
            setTimeout(() => btn.textContent = '📋 Copy', 2000);
          });
        });
      });
    });
    
    // Attach initial copy buttons
    contentContainer.querySelectorAll('.copy-section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.dataset.content;
        navigator.clipboard.writeText(content);
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy', 2000);
      });
    });
    
    resultsPanel.style.display = 'block';
    resultsPanel.scrollIntoView({ behavior: 'smooth' });
  },

  /**
   * Get result tabs based on chain type
   */
  getResultTabs(results) {
    // Social chains (LinkedIn, Twitter, Facebook)
    if (results.linkedin !== undefined && results.twitter !== undefined && results.facebook !== undefined) {
      const tabs = [
        { key: 'linkedin', icon: '🔗', label: 'LinkedIn' },
        { key: 'twitter', icon: '🐦', label: 'Twitter' },
        { key: 'facebook', icon: '📘', label: 'Facebook' }
      ];
      if (results.pressKit) tabs.push({ key: 'pressKit', icon: '📰', label: 'Press Kit' });
      if (results.hashtags) tabs.push({ key: 'hashtags', icon: '#️⃣', label: 'Hashtags' });
      return tabs;
    }
    
    // Google Maps Scanner
    if (results.businesses !== undefined && results.pitchEmails !== undefined) {
      return [
        { key: 'report', icon: '📋', label: 'Report' },
        { key: 'businesses', icon: '🏢', label: 'Leads' },
        { key: 'pitchEmails', icon: '📧', label: 'Pitch Emails' }
      ];
    }
    
    // Ecommerce Scanner
    if (results.stores !== undefined && results.proposals !== undefined) {
      return [
        { key: 'report', icon: '📊', label: 'Report' },
        { key: 'stores', icon: '🛍️', label: 'Stores' },
        { key: 'proposals', icon: '📝', label: 'Proposals' }
      ];
    }
    
    // Lead-to-Email
    if (results.leads !== undefined) {
      return [
        { key: 'leads', icon: '🔍', label: 'Leads' },
        { key: 'emails', icon: '📧', label: 'Emails' },
        { key: 'summary', icon: '📊', label: 'Summary' }
      ];
    }
    
    // Content Repurposer
    if (results.twitterThread !== undefined) {
      return [
        { key: 'summary', icon: '📝', label: 'Summary' },
        { key: 'linkedin', icon: '🔗', label: 'LinkedIn' },
        { key: 'twitterThread', icon: '🐦', label: 'Twitter' },
        { key: 'newsletter', icon: '📰', label: 'Newsletter' }
      ];
    }
    
    // Product Launch Kit
    if (results.landing !== undefined) {
      return [
        { key: 'landing', icon: '🏠', label: 'Landing' },
        { key: 'socialPosts', icon: '📱', label: 'Social' },
        { key: 'pressRelease', icon: '📰', label: 'Press' },
        { key: 'emailBlast', icon: '📧', label: 'Email' },
        { key: 'launchChecklist', icon: '✅', label: 'Checklist' }
      ];
    }
    
    return Object.keys(results).map(key => ({ key, icon: '📄', label: key }));
  },

  /**
   * Render result content
   */
  renderResultContent(key, results) {
    let content = results[key];
    
    // Handle nested objects (like socialPosts)
    if (typeof content === 'object' && !Array.isArray(content)) {
      if (key === 'socialPosts') {
        return Object.entries(content).map(([platform, text]) => `
          <div class="result-section">
            <div class="result-section-header">
              <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              <button class="copy-section-btn" data-content="${this.escapeHtml(text)}">📋 Copy</button>
            </div>
            <pre class="result-text">${this.escapeHtml(text)}</pre>
          </div>
        `).join('');
      }
      content = JSON.stringify(content, null, 2);
    }
    
    // Handle arrays
    if (Array.isArray(content)) {
      // Lead list (original)
      if (key === 'leads') {
        return `
          <div class="result-section">
            <div class="result-section-header">
              <span>Found ${content.length} Leads</span>
              <button class="copy-section-btn" data-content="${this.escapeHtml(content.map(l => `${l.name}, ${l.address}, ${l.phone}`).join('\n'))}">📋 Copy CSV</button>
            </div>
            <div class="leads-list">
              ${content.map(lead => `
                <div class="lead-item">
                  <strong>${lead.name}</strong> <span class="lead-rating">★${lead.rating}</span>
                  <div class="lead-details">${lead.address} • ${lead.phone}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
      
      // Businesses (Google Maps Scanner)
      if (key === 'businesses') {
        const csvData = content.map(b => `"${b.name}","${b.category}","${b.address}","${b.phone}",${b.rating},${b.reviews},${b.opportunityScore}`).join('\n');
        return `
          <div class="result-section">
            <div class="result-section-header">
              <span>Found ${content.length} Businesses Without Websites</span>
              <button class="copy-section-btn" data-content="Name,Category,Address,Phone,Rating,Reviews,Score\n${this.escapeHtml(csvData)}">📋 Export CSV</button>
            </div>
            <div class="leads-list">
              ${content.map((biz, i) => `
                <div class="lead-item ${biz.opportunityScore >= 80 ? 'high-opportunity' : ''}">
                  <div class="lead-header">
                    <strong>${i + 1}. ${biz.name}</strong>
                    <span class="opportunity-score">Score: ${biz.opportunityScore}</span>
                  </div>
                  <div class="lead-category">${biz.category}</div>
                  <div class="lead-details">
                    <span>★${biz.rating} (${biz.reviews} reviews)</span> • 
                    <span>${biz.yearsInBusiness} yrs in business</span>
                  </div>
                  <div class="lead-details">${biz.address}</div>
                  <div class="lead-details">📞 ${biz.phone} • Contact via: ${biz.contactMethod}</div>
                  <div class="lead-social">
                    ${biz.socialPresence.facebook ? '<span class="social-badge fb">📘 Facebook</span>' : ''}
                    ${biz.socialPresence.instagram ? '<span class="social-badge ig">📷 Instagram</span>' : ''}
                    ${biz.socialPresence.yelp ? '<span class="social-badge yelp">⭐ Yelp</span>' : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
      
      // Stores (Ecommerce Scanner)
      if (key === 'stores') {
        const csvData = content.map(s => `"${s.name}","${s.category}","${s.address}","${s.phone}",${s.estimatedSKUs},"${s.ecomPotential}","${s.suggestedPlatform}"`).join('\n');
        return `
          <div class="result-section">
            <div class="result-section-header">
              <span>Found ${content.length} Stores Without E-Commerce</span>
              <button class="copy-section-btn" data-content="Name,Category,Address,Phone,Est SKUs,Potential,Platform\n${this.escapeHtml(csvData)}">📋 Export CSV</button>
            </div>
            <div class="leads-list">
              ${content.map((store, i) => `
                <div class="lead-item ${store.ecomPotential === 'Very High' ? 'high-opportunity' : ''}">
                  <div class="lead-header">
                    <strong>${i + 1}. ${store.name}</strong>
                    <span class="ecom-potential potential-${store.ecomPotential.toLowerCase().replace(' ', '-')}">${store.ecomPotential}</span>
                  </div>
                  <div class="lead-category">${store.category}</div>
                  <div class="lead-details">★${store.rating} (${store.reviews} reviews) • ${store.address}</div>
                  <div class="lead-details">
                    <strong>Products:</strong> ${store.productTypes.join(', ')} • 
                    <strong>Est. SKUs:</strong> ${store.estimatedSKUs}
                  </div>
                  <div class="lead-details">
                    <strong>Suggested:</strong> ${store.suggestedPlatform} • 
                    <strong>Setup:</strong> ${store.estimatedSetupCost} • 
                    <strong>Monthly Rev:</strong> ${store.estimatedMonthlyOnlineRevenue}
                  </div>
                  <div class="lead-social">
                    ${store.socialPresence.instagram ? `<span class="social-badge ig">📷 ${store.instagramFollowers} followers</span>` : '<span class="social-badge none">No Instagram</span>'}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
      
      // Pitch Emails
      if (key === 'pitchEmails') {
        return content.map((email, i) => `
          <div class="result-section">
            <div class="result-section-header">
              <span>Email ${i + 1}: ${email.to}</span>
              <button class="copy-section-btn" data-content="${this.escapeHtml(`Subject: ${email.subject}\n\n${email.body}`)}">📋 Copy</button>
            </div>
            <div class="email-preview">
              <div class="email-subject"><strong>Subject:</strong> ${email.subject}</div>
              <pre class="result-text">${this.escapeHtml(email.body)}</pre>
            </div>
          </div>
        `).join('');
      }
      
      // Proposals (Ecommerce)
      if (key === 'proposals') {
        return content.map((prop, i) => `
          <div class="result-section">
            <div class="result-section-header">
              <span>Proposal ${i + 1}: ${prop.storeName}</span>
              <button class="copy-section-btn" data-content="${this.escapeHtml(prop.proposal)}">📋 Copy</button>
            </div>
            <pre class="result-text">${this.escapeHtml(prop.proposal)}</pre>
          </div>
        `).join('');
      }
      
      // Original emails
      if (key === 'emails') {
        return content.map((email, i) => `
          <div class="result-section">
            <div class="result-section-header">
              <span>Email ${i + 1}: ${email.to}</span>
              <button class="copy-section-btn" data-content="${this.escapeHtml(`Subject: ${email.subject}\n\n${email.body}`)}">📋 Copy</button>
            </div>
            <div class="email-preview">
              <div class="email-subject"><strong>Subject:</strong> ${email.subject}</div>
              <pre class="result-text">${this.escapeHtml(email.body)}</pre>
            </div>
          </div>
        `).join('');
      }
      
      // Hashtags
      if (key === 'hashtags') {
        return `
          <div class="result-section">
            <div class="result-section-header">
              <span>Hashtags</span>
              <button class="copy-section-btn" data-content="${content.join(' ')}">📋 Copy</button>
            </div>
            <div class="hashtags-grid">${content.map(h => `<span class="hashtag-chip">${h}</span>`).join('')}</div>
          </div>
        `;
      }
      
      content = content.join('\n');
    }
    
    // Default text display
    return `
      <div class="result-section">
        <div class="result-section-header">
          <span>Content</span>
          <button class="copy-section-btn" data-content="${this.escapeHtml(content)}">📋 Copy</button>
        </div>
        <pre class="result-text">${this.escapeHtml(content)}</pre>
      </div>
    `;
  },

  /**
   * Copy all results
   */
  copyAllResults() {
    if (!this.currentResults) return;
    
    let allText = `=== ${this.chains[this.currentChain].name} Results ===\n\n`;
    
    const flatten = (obj, prefix = '') => {
      let text = '';
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          text += flatten(value, `${prefix}${key} > `);
        } else if (Array.isArray(value)) {
          text += `\n--- ${prefix}${key} ---\n`;
          if (value[0] && typeof value[0] === 'object') {
            text += value.map(item => JSON.stringify(item)).join('\n');
          } else {
            text += value.join('\n');
          }
          text += '\n';
        } else {
          text += `\n--- ${prefix}${key} ---\n${value}\n`;
        }
      }
      return text;
    };
    
    allText += flatten(this.currentResults);
    
    navigator.clipboard.writeText(allText);
    const btn = document.getElementById('copy-all-btn');
    btn.textContent = '✓ Copied All!';
    setTimeout(() => btn.textContent = '📋 Copy All', 2000);
  },

  /**
   * Helper functions
   */
  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  animateProgress(element, duration) {
    if (!element) return;
    return new Promise(resolve => {
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        element.style.width = (progress * 100) + '%';
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  },

  addLogLine(container, text, type = 'info') {
    const line = document.createElement('div');
    line.className = `output-line ${type}`;
    line.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString()}</span> ${text}`;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('chain-visualizer-container');
  if (container) {
    ChainVisualizer.render('chain-visualizer-container');
  }
});
