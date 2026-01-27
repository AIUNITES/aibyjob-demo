/**
 * AIByJob - Project Plans Module
 * Displays project roadmap and planned features in admin panel
 */

const ProjectPlans = {
  plans: {
    high: [
      {
        title: 'Backend API for Real Google Maps Data',
        status: 'planned',
        effort: '2-4 hours',
        description: 'Connect to real Google Maps Places API for business discovery',
        details: [
          'Get Google Maps API key ($200/mo free credit)',
          'Deploy backend: Google Apps Script (free) or Flask on Render/Railway',
          'Update chain-runner.js to call real API',
          'Backend code ready in /backend folder'
        ],
        chains: ['🗺️ Google Maps No-Website Scanner', '🛒 Retail No-Ecommerce Scanner'],
        files: ['backend/app.py', 'backend/google-apps-script.js', 'backend/SETUP.md']
      }
    ],
    medium: [
      {
        title: 'Real-time Lead Enrichment',
        status: 'planned',
        effort: '4-6 hours',
        description: 'Add LinkedIn company lookup, social media follower counts, estimated revenue'
      },
      {
        title: 'Email Integration',
        status: 'planned',
        effort: '3-4 hours',
        description: 'Connect to Gmail/Outlook for sending pitch emails, track opens/responses'
      },
      {
        title: 'User Accounts & Saved Searches',
        status: 'planned',
        effort: '4-6 hours',
        description: 'Save search history, export to CRM (HubSpot, Salesforce), team sharing'
      }
    ],
    low: [
      {
        title: 'Additional Agent Chains',
        status: 'planned',
        items: ['Competitor Analysis Chain', 'SEO Audit Chain', 'Social Media Scheduler Chain', 'Invoice Generator Chain']
      },
      {
        title: 'UI Enhancements',
        status: 'planned',
        items: ['Dark/Light theme toggle', 'Mobile app (PWA)', 'Browser extension']
      },
      {
        title: 'Integrations',
        status: 'planned',
        items: ['Zapier/Make.com webhooks', 'Slack notifications', 'Google Sheets export']
      }
    ],
    completed: [
      { title: 'Agent Chain Visualizer', date: 'Jan 26, 2026', version: '1.1.0' },
      { title: '5 Working Chains', date: 'Jan 26, 2026', version: '1.2.0' },
      { title: 'Google Maps & Ecom Chains (mock data)', date: 'Jan 26, 2026', version: '1.3.0' },
      { title: 'Backend code prepared', date: 'Jan 26, 2026', version: '1.3.0' },
      { title: 'Flying papers animation', date: 'Jan 26, 2026', version: '1.1.0' },
      { title: 'CloudDB Module', date: 'Jan 24, 2026', version: '1.0.1' }
    ]
  },

  renderPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="max-height: 70vh; overflow-y: auto;">
        <!-- High Priority -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #ef4444; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
            <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%;"></span>
            High Priority
          </h3>
          ${this.plans.high.map(plan => this.renderHighPriorityCard(plan)).join('')}
        </div>

        <!-- Medium Priority -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #f59e0b; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
            <span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></span>
            Medium Priority
          </h3>
          <div style="display: grid; gap: 12px;">
            ${this.plans.medium.map(plan => this.renderMediumCard(plan)).join('')}
          </div>
        </div>

        <!-- Low Priority -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #10b981; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
            <span style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></span>
            Low Priority / Nice to Have
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
            ${this.plans.low.map(plan => this.renderLowCard(plan)).join('')}
          </div>
        </div>

        <!-- Completed -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #6b7280; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
            <span>✅</span>
            Completed
          </h3>
          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;">
              ${this.plans.completed.map(item => `
                <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
                  <span style="color: #10b981;">✓</span>
                  <div>
                    <div style="color: #e5e7eb; font-size: 0.9rem;">${item.title}</div>
                    <div style="color: #6b7280; font-size: 0.75rem;">${item.date} • v${item.version}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 20px;">
          <h4 style="color: #818cf8; margin: 0 0 12px 0;">📅 Suggested Timeline</h4>
          <div style="display: grid; gap: 8px; color: #9ca3af; font-size: 0.9rem;">
            <div><strong style="color: #e5e7eb;">Week 1:</strong> Backend deployment (Google Apps Script)</div>
            <div><strong style="color: #e5e7eb;">Week 2:</strong> Test with real data, refine scoring</div>
            <div><strong style="color: #e5e7eb;">Week 3:</strong> Add email integration</div>
            <div><strong style="color: #e5e7eb;">Week 4:</strong> User feedback & iteration</div>
          </div>
        </div>
      </div>
    `;
  },

  renderHighPriorityCard(plan) {
    return `
      <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 20px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <h4 style="color: #fff; margin: 0 0 4px 0;">${plan.title}</h4>
            <span style="color: #9ca3af; font-size: 0.85rem;">${plan.description}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="background: rgba(245,158,11,0.2); color: #f59e0b; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem;">${plan.effort}</span>
            <span style="background: rgba(99,102,241,0.2); color: #818cf8; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem;">Planned</span>
          </div>
        </div>
        
        <div style="margin-bottom: 12px;">
          <div style="color: #9ca3af; font-size: 0.8rem; margin-bottom: 6px;">What's needed:</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${plan.details.map(d => `<div style="color: #e5e7eb; font-size: 0.85rem; padding-left: 16px;">• ${d}</div>`).join('')}
          </div>
        </div>

        ${plan.chains ? `
          <div style="margin-bottom: 12px;">
            <div style="color: #9ca3af; font-size: 0.8rem; margin-bottom: 6px;">Chains affected:</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${plan.chains.map(c => `<span style="background: rgba(139,92,246,0.2); color: #a78bfa; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem;">${c}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${plan.files ? `
          <div>
            <div style="color: #9ca3af; font-size: 0.8rem; margin-bottom: 6px;">Files ready:</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${plan.files.map(f => `<code style="background: rgba(0,0,0,0.3); color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">${f}</code>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderMediumCard(plan) {
    return `
      <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); border-radius: 12px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="color: #fff; margin: 0 0 4px 0; font-size: 0.95rem;">${plan.title}</h4>
            <span style="color: #9ca3af; font-size: 0.85rem;">${plan.description}</span>
          </div>
          <span style="background: rgba(245,158,11,0.2); color: #f59e0b; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; white-space: nowrap;">${plan.effort}</span>
        </div>
      </div>
    `;
  },

  renderLowCard(plan) {
    return `
      <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px;">
        <h4 style="color: #fff; margin: 0 0 8px 0; font-size: 0.95rem;">${plan.title}</h4>
        ${plan.items ? `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${plan.items.map(item => `<div style="color: #9ca3af; font-size: 0.85rem;">☐ ${item}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Listen for plans tab activation
  const plansTab = document.querySelector('[data-admin-tab="plans"]');
  if (plansTab) {
    plansTab.addEventListener('click', () => {
      setTimeout(() => {
        ProjectPlans.renderPanel('project-plans-panel');
      }, 100);
    });
  }
});
