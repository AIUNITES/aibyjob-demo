/**
 * Agent Chain Visualizer
 * Animated demonstration of AI agents working together
 * AIByJob - AIUNITES Network
 */

const ChainVisualizer = {
  // Demo chain configurations
  chains: {
    'content-pipeline': {
      name: 'Content Creation Pipeline',
      description: 'Research → Write → Optimize → Publish',
      agents: [
        { id: 'research', icon: '🔍', name: 'Research', color: '#06b6d4', action: 'Finding trending topics...' },
        { id: 'writer', icon: '✍️', name: 'Writer', color: '#8b5cf6', action: 'Drafting content...' },
        { id: 'seo', icon: '📈', name: 'SEO', color: '#22c55e', action: 'Optimizing for search...' },
        { id: 'publisher', icon: '🚀', name: 'Publisher', color: '#ff3366', action: 'Scheduling posts...' }
      ],
      outputs: [
        '📊 Found 5 trending topics in your niche',
        '📝 Generated 800-word blog post',
        '🎯 Added 12 keywords, meta description',
        '✅ Scheduled for optimal posting time'
      ]
    },
    'lead-outreach': {
      name: 'Lead-to-Outreach Pipeline',
      description: 'Find leads → Create content → Send outreach',
      agents: [
        { id: 'leadfinder', icon: '🔍', name: 'LeadFinder', color: '#06b6d4', action: 'Scanning directories...' },
        { id: 'analyzer', icon: '📊', name: 'Analyzer', color: '#f59e0b', action: 'Scoring leads...' },
        { id: 'promotion', icon: '📣', name: 'Promotion', color: '#ff3366', action: 'Creating personalized posts...' },
        { id: 'outreach', icon: '📧', name: 'Outreach', color: '#10b981', action: 'Preparing emails...' }
      ],
      outputs: [
        '🏢 Found 23 businesses without websites',
        '⭐ Scored and ranked by potential (Top 10 selected)',
        '📱 Created LinkedIn + Twitter posts for each',
        '✉️ Drafted 10 personalized outreach emails'
      ]
    },
    'website-launch': {
      name: 'Website Launch Workflow',
      description: 'Build site → SEO → Launch campaign',
      agents: [
        { id: 'webbuilder', icon: '🏗️', name: 'WebBuilder', color: '#f59e0b', action: 'Generating HTML/CSS...' },
        { id: 'seo', icon: '🎯', name: 'SEO Setup', color: '#22c55e', action: 'Adding meta tags...' },
        { id: 'qa', icon: '🔬', name: 'QA Check', color: '#8b5cf6', action: 'Testing responsive design...' },
        { id: 'promotion', icon: '📣', name: 'Promotion', color: '#ff3366', action: 'Creating launch posts...' }
      ],
      outputs: [
        '🌐 Built 5-page responsive website',
        '🔍 Added schema markup + sitemap',
        '✅ Passed mobile & accessibility tests',
        '🎉 Created launch announcement campaign'
      ]
    }
  },

  isRunning: false,
  currentChain: null,

  /**
   * Render the chain visualizer in a container
   */
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="chain-visualizer">
        <!-- Chain Selector -->
        <div class="chain-selector">
          <h4>🔗 Select a Chain to Demo</h4>
          <div class="chain-buttons">
            ${Object.entries(this.chains).map(([key, chain]) => `
              <button class="chain-select-btn ${key === 'content-pipeline' ? 'active' : ''}" data-chain="${key}">
                <span class="chain-btn-name">${chain.name}</span>
                <span class="chain-btn-desc">${chain.description}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Visual Chain Display -->
        <div class="chain-display" id="chain-display">
          ${this.renderChain('content-pipeline')}
        </div>

        <!-- Output Log -->
        <div class="chain-output">
          <div class="output-header">
            <span>📋 Output Log</span>
            <span class="output-status" id="chain-status">Ready</span>
          </div>
          <div class="output-log" id="chain-output-log">
            <div class="output-line dim">Click "Run Demo" to see the chain in action...</div>
          </div>
        </div>

        <!-- Run Button -->
        <div class="chain-actions">
          <button class="btn-run-chain" id="run-chain-btn">
            <span class="run-icon">▶️</span>
            <span>Run Demo Chain</span>
          </button>
        </div>
      </div>
    `;

    this.attachEvents(containerId);
  },

  /**
   * Render a specific chain's visual flow
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

    // Chain selector buttons
    container.querySelectorAll('.chain-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isRunning) return;
        
        container.querySelectorAll('.chain-select-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const chainKey = btn.dataset.chain;
        document.getElementById('chain-display').innerHTML = this.renderChain(chainKey);
        this.currentChain = chainKey;
        
        // Reset output
        document.getElementById('chain-output-log').innerHTML = 
          '<div class="output-line dim">Click "Run Demo" to see the chain in action...</div>';
        document.getElementById('chain-status').textContent = 'Ready';
        document.getElementById('chain-status').className = 'output-status';
      });
    });

    // Run button
    const runBtn = document.getElementById('run-chain-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const activeChain = container.querySelector('.chain-select-btn.active');
        if (activeChain && !this.isRunning) {
          this.runChainDemo(activeChain.dataset.chain);
        }
      });
    }
  },

  /**
   * Run the animated chain demo
   */
  async runChainDemo(chainKey) {
    if (this.isRunning) return;
    
    const chain = this.chains[chainKey];
    if (!chain) return;

    this.isRunning = true;
    this.currentChain = chainKey;

    const runBtn = document.getElementById('run-chain-btn');
    const status = document.getElementById('chain-status');
    const log = document.getElementById('chain-output-log');

    // Update UI
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="run-icon spinning">⚙️</span><span>Running...</span>';
    status.textContent = 'Running';
    status.className = 'output-status running';
    log.innerHTML = '';

    // Add start message
    this.addLogLine(log, '🚀 Starting chain: ' + chain.name, 'info');
    await this.delay(500);

    // Run through each agent
    for (let i = 0; i < chain.agents.length; i++) {
      const agent = chain.agents[i];
      const agentEl = document.querySelector(`.chain-agent[data-agent="${agent.id}"]`);
      
      if (agentEl) {
        // Activate agent
        agentEl.classList.add('active');
        this.addLogLine(log, `${agent.icon} ${agent.name}: ${agent.action}`, 'processing');
        
        // Animate progress
        const progress = agentEl.querySelector('.progress-fill');
        if (progress) {
          progress.style.width = '0%';
          await this.animateProgress(progress, 1500);
        }

        // Complete agent
        agentEl.classList.remove('active');
        agentEl.classList.add('complete');
        this.addLogLine(log, chain.outputs[i], 'success');

        // Animate data packet to next agent
        if (i < chain.agents.length - 1) {
          const packet = document.querySelector(`.data-packet[data-packet="${i}"]`);
          if (packet) {
            packet.classList.add('moving');
            await this.delay(1000); // Wait for flying papers animation
            packet.classList.remove('moving');
          }
        }

        await this.delay(300);
      }
    }

    // Complete
    status.textContent = 'Complete ✓';
    status.className = 'output-status complete';
    this.addLogLine(log, '✅ Chain completed successfully!', 'complete');
    
    runBtn.disabled = false;
    runBtn.innerHTML = '<span class="run-icon">🔄</span><span>Run Again</span>';
    
    // Reset after delay
    setTimeout(() => {
      this.resetChain(chainKey);
      runBtn.innerHTML = '<span class="run-icon">▶️</span><span>Run Demo Chain</span>';
    }, 3000);

    this.isRunning = false;
  },

  /**
   * Reset chain visual state
   */
  resetChain(chainKey) {
    document.querySelectorAll('.chain-agent').forEach(el => {
      el.classList.remove('active', 'complete');
      const progress = el.querySelector('.progress-fill');
      if (progress) progress.style.width = '0%';
    });
  },

  /**
   * Animate progress bar
   */
  animateProgress(element, duration) {
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

  /**
   * Add a line to the output log
   */
  addLogLine(container, text, type = 'info') {
    const line = document.createElement('div');
    line.className = `output-line ${type}`;
    line.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString()}</span> ${text}`;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  },

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('chain-visualizer-container');
  if (container) {
    ChainVisualizer.render('chain-visualizer-container');
  }
});
