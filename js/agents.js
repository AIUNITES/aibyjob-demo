/**
 * AIByJob Agents Module
 * Handles AI agent workspace and simulations
 */

// Agent definitions
const AGENTS = {
  webbuilder: {
    name: 'WebBuilder',
    icon: '🏗️',
    title: '🏗️ WebBuilder Agent',
    description: 'Builds complete websites from a description',
    fullPage: 'agents/webbuilder.html',
    steps: [
      'Analyzing business requirements...',
      'Designing layout structure...',
      'Generating HTML framework...',
      'Creating responsive CSS...',
      'Adding interactive JavaScript...',
      'Optimizing for SEO...',
      'Compressing assets...',
      'Deploying to GitHub Pages...',
      '✅ Website deployed successfully!'
    ],
    form: `
      <div class="form-group">
        <label>Business Name</label>
        <input type="text" id="agent-input-1" placeholder="e.g., Sweet Dreams Bakery">
      </div>
      <div class="form-group">
        <label>Industry</label>
        <select id="agent-input-2">
          <option value="">Select industry...</option>
          <option value="restaurant">Restaurant / Food</option>
          <option value="retail">Retail / E-commerce</option>
          <option value="professional">Professional Services</option>
          <option value="healthcare">Healthcare / Wellness</option>
          <option value="technology">Technology / SaaS</option>
        </select>
      </div>
      <div class="form-group">
        <label>Website Description</label>
        <textarea id="agent-input-3" rows="3" placeholder="Describe what you want..."></textarea>
      </div>
    `,
    getPreview: function(inputs) {
      const name = inputs[0] || 'Your Business';
      const industry = inputs[1] || 'business';
      const icons = {
        'restaurant': '🍽️',
        'retail': '🛍️',
        'professional': '💼',
        'healthcare': '🏥',
        'technology': '💻',
        '': '🏢'
      };
      const icon = icons[industry] || '🏢';
      return `
        <div style="padding: 15px; width: 100%;">
          <div style="background: linear-gradient(135deg, #ff3366, #ff6b35); padding: 20px; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="color: white; margin: 0;">${icon} ${name}</h4>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 12px;">Your professional website</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 11px;">
            <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">Home</div>
            <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">Services</div>
            <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">About</div>
            <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">Contact</div>
          </div>
          <p style="color: #10b981; font-size: 11px; margin: 10px 0 0;">✓ 4 pages • SEO optimized • Mobile-ready</p>
          <a href="https://aiunites.github.io/cloudsion-site/" target="_blank" style="display: block; margin-top: 10px; padding: 8px 12px; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); color: #fff; text-align: center; border-radius: 6px; text-decoration: none; font-size: 11px;">☁️ Deploy to Cloudsion</a>
        </div>
      `;
    },
    // Static fallback preview
    preview: `
      <div style="padding: 15px; width: 100%;">
        <div style="background: linear-gradient(135deg, #ff3366, #ff6b35); padding: 20px; border-radius: 8px; margin-bottom: 10px;">
          <h4 style="color: white; margin: 0;">🏢 Your Business</h4>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 12px;">Your professional website</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 11px;">
          <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">Home</div>
          <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">Services</div>
          <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">About</div>
          <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; text-align: center;">Contact</div>
        </div>
        <p style="color: #10b981; font-size: 11px; margin: 10px 0 0;">✓ 4 pages • SEO optimized • Mobile-ready</p>
        <a href="https://aiunites.github.io/cloudsion-site/" target="_blank" style="display: block; margin-top: 10px; padding: 8px 12px; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); color: #fff; text-align: center; border-radius: 6px; text-decoration: none; font-size: 11px;">☁️ Deploy to Cloudsion</a>
      </div>
    `
  },
  marketing: {
    name: 'MarketingPro',
    icon: '📈',
    title: '📈 MarketingPro Agent',
    description: 'Digital marketing automation',
    steps: [
      'Analyzing target audience...',
      'Researching competitors...',
      'Generating content strategy...',
      'Creating social media posts...',
      'Scheduling email campaigns...',
      'Optimizing ad targeting...',
      'Tracking engagement metrics...',
      'Generating performance report...',
      '✅ Marketing campaign activated!'
    ],
    form: `
      <div class="form-group">
        <label>Brand Name</label>
        <input type="text" id="agent-input-1" placeholder="e.g., FitLife Gym">
      </div>
      <div class="form-group">
        <label>Website URL</label>
        <input type="text" id="agent-input-2" placeholder="https://example.com">
      </div>
      <div class="form-group">
        <label>Target Audience</label>
        <textarea id="agent-input-3" rows="2" placeholder="Describe your target audience..."></textarea>
      </div>
      <div class="form-group">
        <label>Campaign Duration</label>
        <select id="agent-input-4">
          <option value="7">1 Week</option>
          <option value="30" selected>30 Days</option>
          <option value="90">90 Days</option>
        </select>
      </div>
    `,
    getPreview: function(inputs) {
      const brand = inputs[0] || 'Your Brand';
      const duration = inputs[3] || '30';
      return `
        <div style="padding: 15px; width: 100%;">
          <h4 style="color: #ff3366; margin: 0 0 12px;">📅 ${duration}-Day Content Calendar</h4>
          <p style="font-size: 12px; color: #888; margin-bottom: 12px;">for <strong style="color: #fff;">${brand}</strong></p>
          <div style="font-size: 11px;">
            <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; margin-bottom: 6px;">
              <strong>Week 1-2:</strong> Brand awareness, engagement
            </div>
            <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; margin-bottom: 6px;">
              <strong>Week 3-4:</strong> Conversions, promotions
            </div>
            <p style="color: #10b981; margin: 10px 0 0;">✓ 90 posts scheduled • 3 platforms</p>
          </div>
        </div>
      `;
    },
    preview: `
      <div style="padding: 15px; width: 100%;">
        <h4 style="color: #ff3366; margin: 0 0 12px;">📅 30-Day Content Calendar</h4>
        <div style="font-size: 11px;">
          <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; margin-bottom: 6px;">
            <strong>Week 1-2:</strong> Brand awareness, engagement
          </div>
          <div style="background: rgba(255,51,102,0.1); padding: 10px; border-radius: 6px; margin-bottom: 6px;">
            <strong>Week 3-4:</strong> Conversions, promotions
          </div>
          <p style="color: #10b981; margin: 10px 0 0;">✓ 90 posts scheduled • 3 platforms</p>
        </div>
      </div>
    `
  },
  leadfinder: {
    name: 'LeadFinder',
    icon: '🔍',
    title: '🔍 LeadFinder Agent',
    description: 'Find businesses without websites',
    fullPage: 'agents/leadfinder.html',
    steps: [
      'Connecting to Google Maps API...',
      'Scanning business listings...',
      'Found 847 businesses in target area',
      'Checking for website presence...',
      'Analyzing Yelp profiles...',
      'Detecting Facebook-only businesses...',
      'Extracting contact information...',
      'Scoring lead quality...',
      '✅ Found 47 qualified leads!'
    ],
    form: `
      <div class="form-group">
        <label>Location</label>
        <input type="text" id="agent-input-1" placeholder="e.g., Austin, TX">
      </div>
      <div class="form-group">
        <label>Search Radius</label>
        <select id="agent-input-2">
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="25" selected>25 miles</option>
          <option value="50">50 miles</option>
        </select>
      </div>
      <div class="form-group">
        <label>Industry</label>
        <select id="agent-input-3">
          <option value="">All Industries</option>
          <option value="restaurant">Restaurants</option>
          <option value="retail">Retail Stores</option>
          <option value="services">Professional Services</option>
          <option value="healthcare">Healthcare</option>
        </select>
      </div>
      <div class="form-group">
        <label>Min Rating</label>
        <select id="agent-input-4">
          <option value="3">3+ stars</option>
          <option value="4" selected>4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>
    `,
    getPreview: function(inputs) {
      const location = inputs[0] || 'your area';
      const radius = inputs[1] || '25';
      return `
        <div style="padding: 15px; width: 100%;">
          <h4 style="color: #ff3366; margin: 0 0 12px;">🔍 Lead Report - ${location}</h4>
          <p style="font-size: 11px; color: #888; margin-bottom: 12px;">${radius} mile radius</p>
          <div style="display: flex; gap: 10px; margin-bottom: 12px;">
            <div style="flex: 1; background: rgba(16,185,129,0.1); padding: 10px; border-radius: 6px; text-align: center;">
              <span style="font-size: 20px; color: #10b981;">47</span>
              <p style="font-size: 10px; color: #888; margin: 4px 0 0;">No Website</p>
            </div>
            <div style="flex: 1; background: rgba(59,130,246,0.1); padding: 10px; border-radius: 6px; text-align: center;">
              <span style="font-size: 20px; color: #3b82f6;">23</span>
              <p style="font-size: 10px; color: #888; margin: 4px 0 0;">FB Only</p>
            </div>
          </div>
          <div style="font-size: 11px; color: #888;">
            <div style="padding: 6px 0; border-bottom: 1px solid #333;">Taco Haven - 512-555-0123</div>
            <div style="padding: 6px 0; border-bottom: 1px solid #333;">BBQ Brothers - 512-555-0456</div>
            <div style="padding: 6px 0;">Pho King Good - 512-555-0789</div>
          </div>
        </div>
      `;
    },
    preview: `
      <div style="padding: 15px; width: 100%;">
        <h4 style="color: #ff3366; margin: 0 0 12px;">🔍 Lead Report</h4>
        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
          <div style="flex: 1; background: rgba(16,185,129,0.1); padding: 10px; border-radius: 6px; text-align: center;">
            <span style="font-size: 20px; color: #10b981;">47</span>
            <p style="font-size: 10px; color: #888; margin: 4px 0 0;">No Website</p>
          </div>
          <div style="flex: 1; background: rgba(59,130,246,0.1); padding: 10px; border-radius: 6px; text-align: center;">
            <span style="font-size: 20px; color: #3b82f6;">23</span>
            <p style="font-size: 10px; color: #888; margin: 4px 0 0;">FB Only</p>
          </div>
        </div>
        <div style="font-size: 11px; color: #888;">
          <div style="padding: 6px 0; border-bottom: 1px solid #333;">Taco Haven - 512-555-0123</div>
          <div style="padding: 6px 0; border-bottom: 1px solid #333;">BBQ Brothers - 512-555-0456</div>
          <div style="padding: 6px 0;">Pho King Good - 512-555-0789</div>
        </div>
      </div>
    `
  },
  ecomscout: {
    name: 'EcomScout',
    icon: '🛒',
    title: '🛒 EcomScout Agent',
    description: 'Find stores without e-commerce',
    fullPage: 'agents/ecomscout.html',
    steps: [
      'Discovering retail stores in area...',
      'Found 234 retail businesses...',
      'Analyzing website structures...',
      'Detecting shopping cart presence...',
      'Checking payment gateway integrations...',
      'Scanning for add-to-cart buttons...',
      'Estimating revenue potential...',
      'Analyzing competitor e-commerce...',
      '✅ Found 34 e-commerce opportunities!'
    ],
    form: `
      <div class="form-group">
        <label>Location</label>
        <input type="text" id="agent-input-1" placeholder="e.g., Denver, CO">
      </div>
      <div class="form-group">
        <label>Retail Category</label>
        <select id="agent-input-2">
          <option value="">All Categories</option>
          <option value="clothing">Clothing & Apparel</option>
          <option value="jewelry">Jewelry</option>
          <option value="home">Home & Furniture</option>
          <option value="beauty">Beauty & Cosmetics</option>
        </select>
      </div>
      <div class="form-group">
        <label>Min Est. Revenue</label>
        <select id="agent-input-3">
          <option value="100000">$100K+/year</option>
          <option value="250000">$250K+/year</option>
          <option value="500000" selected>$500K+/year</option>
        </select>
      </div>
    `,
    getPreview: function(inputs) {
      const location = inputs[0] || 'your area';
      return `
        <div style="padding: 15px; width: 100%;">
          <h4 style="color: #ff3366; margin: 0 0 12px;">🛒 E-Commerce Opportunities - ${location}</h4>
          <div style="display: flex; gap: 10px; margin-bottom: 12px;">
            <div style="flex: 1; background: rgba(16,185,129,0.1); padding: 10px; border-radius: 6px; text-align: center;">
              <span style="font-size: 20px; color: #10b981;">34</span>
              <p style="font-size: 10px; color: #888; margin: 4px 0 0;">No E-Com</p>
            </div>
            <div style="flex: 1; background: rgba(139,92,246,0.1); padding: 10px; border-radius: 6px; text-align: center;">
              <span style="font-size: 20px; color: #8b5cf6;">$1.2M</span>
              <p style="font-size: 10px; color: #888; margin: 4px 0 0;">Potential</p>
            </div>
          </div>
          <div style="font-size: 11px; color: #888;">
            <div style="padding: 6px 0; border-bottom: 1px solid #333;">Chic Boutique - $45K potential</div>
            <div style="padding: 6px 0; border-bottom: 1px solid #333;">Mountain Style - $62K potential</div>
            <div style="padding: 6px 0;">Vintage Vibes - $38K potential</div>
          </div>
        </div>
      `;
    },
    preview: `
      <div style="padding: 15px; width: 100%;">
        <h4 style="color: #ff3366; margin: 0 0 12px;">🛒 E-Commerce Opportunities</h4>
        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
          <div style="flex: 1; background: rgba(16,185,129,0.1); padding: 10px; border-radius: 6px; text-align: center;">
            <span style="font-size: 20px; color: #10b981;">34</span>
            <p style="font-size: 10px; color: #888; margin: 4px 0 0;">No E-Com</p>
          </div>
          <div style="flex: 1; background: rgba(139,92,246,0.1); padding: 10px; border-radius: 6px; text-align: center;">
            <span style="font-size: 20px; color: #8b5cf6;">$1.2M</span>
            <p style="font-size: 10px; color: #888; margin: 4px 0 0;">Potential</p>
          </div>
        </div>
        <div style="font-size: 11px; color: #888;">
          <div style="padding: 6px 0; border-bottom: 1px solid #333;">Chic Boutique - $45K potential</div>
          <div style="padding: 6px 0; border-bottom: 1px solid #333;">Mountain Style - $62K potential</div>
          <div style="padding: 6px 0;">Vintage Vibes - $38K potential</div>
        </div>
      </div>
    `
  }
};

// Current active agent
let currentAgent = null;
let landingActiveAgent = 'webbuilder';

// ==================== LANDING PAGE DEMO ====================

// Initialize landing page demo
function initLandingDemo() {
  // Agent selection buttons
  document.querySelectorAll('.demo-agent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.demo-agent-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      landingActiveAgent = btn.dataset.agent;
      updateLandingTerminalTitle();
      resetLandingTerminal();
    });
  });
  
  // Quick command buttons
  document.querySelectorAll('.quick-cmd').forEach(btn => {
    btn.addEventListener('click', () => {
      const agentId = btn.dataset.cmd;
      const task = btn.dataset.task;
      
      // Update active agent
      document.querySelectorAll('.demo-agent-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`.demo-agent-btn[data-agent="${agentId}"]`)?.classList.add('active');
      landingActiveAgent = agentId;
      
      updateLandingTerminalTitle();
      runLandingDemo(task);
    });
  });
}

// Update landing terminal title
function updateLandingTerminalTitle() {
  const agent = AGENTS[landingActiveAgent];
  const title = document.getElementById('landing-terminal-title');
  if (title) {
    title.textContent = `Agent Output — ${agent.name}`;
  }
}

// Reset landing terminal
function resetLandingTerminal() {
  const terminal = document.getElementById('landing-terminal-output');
  const agent = AGENTS[landingActiveAgent];
  if (!terminal) return;
  
  terminal.innerHTML = `
    <div class="terminal-line"><span class="terminal-prompt">▶</span><span class="terminal-text">${agent.name} Agent initialized...</span></div>
    <div class="terminal-line"><span class="terminal-prompt">▶</span><span class="terminal-text success">Ready to accept tasks</span></div>
    <div class="terminal-line"><span class="terminal-prompt">▶</span><span class="terminal-text dim">Click a quick command to see it in action...</span></div>
  `;
  
  // Reset preview
  const preview = document.getElementById('landing-preview-frame');
  if (preview) {
    preview.innerHTML = `
      <div class="preview-placeholder">
        <span class="preview-icon">🖼️</span>
        <p>Results appear here</p>
      </div>
    `;
  }
}

// Run landing page demo
function runLandingDemo(task) {
  const agent = AGENTS[landingActiveAgent];
  const terminal = document.getElementById('landing-terminal-output');
  if (!terminal) return;
  
  // Clear terminal
  terminal.innerHTML = '';
  
  // Add task received
  addLandingTerminalLine(terminal, `Task: "${task}"`, 'dim');
  addLandingTerminalLine(terminal, `${agent.name} starting execution...`, 'success');
  
  // Simulate steps
  let delay = 400;
  agent.steps.forEach((step, index) => {
    setTimeout(() => {
      const isLast = index === agent.steps.length - 1;
      const isSuccess = step.includes('✅');
      addLandingTerminalLine(terminal, step, isSuccess ? 'success' : '');
      terminal.scrollTop = terminal.scrollHeight;
      
      if (isLast) {
        showLandingPreview(task);
      }
    }, delay);
    delay += 500 + Math.random() * 300;
  });
}

// Add line to landing terminal
function addLandingTerminalLine(terminal, text, className) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.innerHTML = `<span class="terminal-prompt">▶</span><span class="terminal-text ${className}">${text}</span>`;
  terminal.appendChild(line);
}

// Show landing preview - now uses task to customize
function showLandingPreview(task) {
  const preview = document.getElementById('landing-preview-frame');
  const agent = AGENTS[landingActiveAgent];
  
  if (preview && agent) {
    // Try to use dynamic preview if available
    if (agent.getPreview) {
      // Extract inputs from task
      const inputs = [task, '', '', ''];
      preview.innerHTML = agent.getPreview(inputs);
    } else if (agent.preview) {
      preview.innerHTML = agent.preview;
    }
  }
}

// ==================== DASHBOARD AGENT MODAL ====================

// Launch agent modal
function launchAgent(agentId) {
  const agent = AGENTS[agentId];
  if (!agent) return;
  
  currentAgent = agentId;
  
  // Set modal title
  document.getElementById('agent-modal-title').textContent = agent.title;
  
  // Set form content with optional link to full page
  let formHtml = agent.form;
  if (agent.fullPage) {
    formHtml += `
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
        <a href="${agent.fullPage}" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 8px; color: #0ea5e9; text-decoration: none; font-size: 0.9rem;">
          🚀 Open Full ${agent.name} Agent →
        </a>
      </div>
    `;
  }
  document.getElementById('agent-form-content').innerHTML = formHtml;
  
  // Reset terminal
  resetAgentTerminal();
  
  // Reset preview
  document.getElementById('agent-preview-frame').innerHTML = `
    <div class="preview-placeholder">
      <span class="preview-icon">🖼️</span>
      <p>Results will appear here</p>
    </div>
  `;
  
  // Show modal
  document.getElementById('agent-modal').classList.add('active');
}

// Reset terminal to ready state
function resetAgentTerminal() {
  const terminal = document.getElementById('agent-terminal-output');
  terminal.innerHTML = `
    <div class="terminal-line">
      <span class="terminal-prompt">▶</span>
      <span class="terminal-text">Agent ready. Configure and click Run.</span>
    </div>
  `;
}

// Run agent
function runAgent() {
  if (!currentAgent) return;
  
  const agent = AGENTS[currentAgent];
  const terminal = document.getElementById('agent-terminal-output');
  
  // Clear terminal
  terminal.innerHTML = '';
  
  // Get all input values for personalization
  const inputs = [];
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`agent-input-${i}`);
    inputs.push(el ? el.value : '');
  }
  
  const input1 = inputs[0] || 'target';
  
  // Add starting message
  addTerminalLine(terminal, `Starting ${agent.name} for "${input1}"...`, '');
  
  // Simulate steps
  let delay = 500;
  agent.steps.forEach((step, index) => {
    setTimeout(() => {
      const isLast = index === agent.steps.length - 1;
      const isSuccess = step.includes('✅') || step.includes('Found');
      addTerminalLine(terminal, step, isSuccess ? 'success' : '');
      terminal.scrollTop = terminal.scrollHeight;
      
      if (isLast) {
        showAgentPreview(inputs);
      }
    }, delay);
    delay += 600 + Math.random() * 400;
  });
}

// Add line to terminal
function addTerminalLine(terminal, text, className) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.innerHTML = `
    <span class="terminal-prompt">▶</span>
    <span class="terminal-text ${className}">${text}</span>
  `;
  terminal.appendChild(line);
}

// Show preview based on agent type - now dynamic!
function showAgentPreview(inputs) {
  const preview = document.getElementById('agent-preview-frame');
  const agent = AGENTS[currentAgent];
  
  if (preview && agent) {
    // Use dynamic preview if available
    if (agent.getPreview) {
      preview.innerHTML = agent.getPreview(inputs);
    } else if (agent.preview) {
      preview.innerHTML = agent.preview;
    } else {
      preview.innerHTML = '<p style="text-align:center;color:#888;">Preview not available</p>';
    }
  }
}

// Initialize agent modal events
document.addEventListener('DOMContentLoaded', () => {
  // Initialize landing page demo
  initLandingDemo();
  
  // Close modal
  document.getElementById('close-agent-modal')?.addEventListener('click', () => {
    document.getElementById('agent-modal').classList.remove('active');
    currentAgent = null;
  });
  
  // Run agent button
  document.getElementById('run-agent-btn')?.addEventListener('click', runAgent);
  
  // Close on backdrop click
  document.getElementById('agent-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'agent-modal') {
      document.getElementById('agent-modal').classList.remove('active');
      currentAgent = null;
    }
  });
});
