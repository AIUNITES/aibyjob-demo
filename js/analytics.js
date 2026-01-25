/**
 * AIByJob Analytics Module
 * Tracks usage patterns to understand what's popular
 */

const Analytics = {
  STORAGE_KEY: 'aibyjob_analytics',
  
  // Get all analytics data
  getData() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing analytics data:', e);
      }
    }
    return this.getDefaultData();
  },
  
  getDefaultData() {
    return {
      agents: {},      // { agentId: { launches: 0, lastUsed: null, tasks: [] } }
      features: {},    // { featureId: { uses: 0, lastUsed: null } }
      pages: {},       // { pagePath: { views: 0, lastViewed: null } }
      sessions: [],    // [{ start: timestamp, end: timestamp, actions: [] }]
      totals: {
        agentLaunches: 0,
        tasksCompleted: 0,
        postsGenerated: 0,
        leadsFound: 0,
        chainsCreated: 0
      },
      firstUse: null,
      lastActivity: null
    };
  },
  
  // Save analytics data
  save(data) {
    data.lastActivity = new Date().toISOString();
    if (!data.firstUse) data.firstUse = data.lastActivity;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },
  
  // Track agent launch
  trackAgentLaunch(agentId, agentName) {
    const data = this.getData();
    
    if (!data.agents[agentId]) {
      data.agents[agentId] = {
        name: agentName,
        launches: 0,
        lastUsed: null,
        tasks: []
      };
    }
    
    data.agents[agentId].launches++;
    data.agents[agentId].lastUsed = new Date().toISOString();
    data.totals.agentLaunches++;
    
    this.save(data);
    this.submitToCloud('AGENT_LAUNCH', { agentId, agentName });
    
    console.log(`📊 Analytics: ${agentName} launched (total: ${data.agents[agentId].launches})`);
    return data.agents[agentId];
  },
  
  // Track task completion
  trackTaskComplete(agentId, taskType, result = {}) {
    const data = this.getData();
    
    if (!data.agents[agentId]) {
      data.agents[agentId] = { name: agentId, launches: 0, lastUsed: null, tasks: [] };
    }
    
    const task = {
      type: taskType,
      timestamp: new Date().toISOString(),
      result: result
    };
    
    data.agents[agentId].tasks.push(task);
    data.agents[agentId].lastUsed = task.timestamp;
    data.totals.tasksCompleted++;
    
    // Update specific counters
    if (taskType === 'post_generated') data.totals.postsGenerated++;
    if (taskType === 'leads_found') data.totals.leadsFound += (result.count || 1);
    
    this.save(data);
    this.submitToCloud('TASK_COMPLETE', { agentId, taskType, ...result });
    
    return task;
  },
  
  // Track feature usage
  trackFeature(featureId, featureName) {
    const data = this.getData();
    
    if (!data.features[featureId]) {
      data.features[featureId] = {
        name: featureName,
        uses: 0,
        lastUsed: null
      };
    }
    
    data.features[featureId].uses++;
    data.features[featureId].lastUsed = new Date().toISOString();
    
    this.save(data);
    this.submitToCloud('FEATURE_USE', { featureId, featureName });
    
    return data.features[featureId];
  },
  
  // Track page view
  trackPageView(pagePath) {
    const data = this.getData();
    
    if (!data.pages[pagePath]) {
      data.pages[pagePath] = { views: 0, lastViewed: null };
    }
    
    data.pages[pagePath].views++;
    data.pages[pagePath].lastViewed = new Date().toISOString();
    
    this.save(data);
    // Don't submit page views to cloud to reduce noise
    
    return data.pages[pagePath];
  },
  
  // Track chain creation
  trackChainCreate(chainName, agents) {
    const data = this.getData();
    data.totals.chainsCreated++;
    this.save(data);
    this.submitToCloud('CHAIN_CREATE', { chainName, agents });
  },
  
  // Submit to cloud (if enabled)
  async submitToCloud(eventType, eventData) {
    if (typeof CloudDB !== 'undefined' && CloudDB.isEnabled()) {
      const user = this.getCurrentUser();
      await CloudDB.submit('USAGE', {
        event: eventType,
        user: user?.username || 'anonymous',
        ...eventData,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('aibyjob_currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },
  
  // Get popular agents
  getPopularAgents(limit = 5) {
    const data = this.getData();
    return Object.entries(data.agents)
      .map(([id, info]) => ({ id, ...info }))
      .sort((a, b) => b.launches - a.launches)
      .slice(0, limit);
  },
  
  // Get popular features
  getPopularFeatures(limit = 5) {
    const data = this.getData();
    return Object.entries(data.features)
      .map(([id, info]) => ({ id, ...info }))
      .sort((a, b) => b.uses - a.uses)
      .slice(0, limit);
  },
  
  // Get summary stats
  getSummary() {
    const data = this.getData();
    return {
      totalAgentLaunches: data.totals.agentLaunches,
      totalTasksCompleted: data.totals.tasksCompleted,
      totalPostsGenerated: data.totals.postsGenerated,
      totalLeadsFound: data.totals.leadsFound,
      totalChainsCreated: data.totals.chainsCreated,
      uniqueAgentsUsed: Object.keys(data.agents).length,
      uniqueFeaturesUsed: Object.keys(data.features).length,
      firstUse: data.firstUse,
      lastActivity: data.lastActivity
    };
  },
  
  // Render analytics panel for admin
  renderAnalyticsPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const data = this.getData();
    const summary = this.getSummary();
    const popularAgents = this.getPopularAgents(5);
    
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: rgba(255,51,102,0.1); border: 1px solid rgba(255,51,102,0.2); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 1.75rem; font-weight: bold; color: #ff3366;">${summary.totalAgentLaunches}</div>
          <div style="color: #9ca3af; font-size: 0.85rem;">Agent Launches</div>
        </div>
        <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 1.75rem; font-weight: bold; color: #10b981;">${summary.totalTasksCompleted}</div>
          <div style="color: #9ca3af; font-size: 0.85rem;">Tasks Done</div>
        </div>
        <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 1.75rem; font-weight: bold; color: #f59e0b;">${summary.totalPostsGenerated}</div>
          <div style="color: #9ca3af; font-size: 0.85rem;">Posts Generated</div>
        </div>
        <div style="background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 1.75rem; font-weight: bold; color: #8b5cf6;">${summary.totalLeadsFound}</div>
          <div style="color: #9ca3af; font-size: 0.85rem;">Leads Found</div>
        </div>
      </div>
      
      <h4 style="color: #fff; margin-bottom: 12px;">🏆 Most Popular Agents</h4>
      <div style="background: rgba(30,30,40,0.6); border-radius: 8px; overflow: hidden;">
        ${popularAgents.length === 0 ? `
          <div style="padding: 24px; text-align: center; color: #6b7280;">
            No usage data yet. Launch some agents to see stats!
          </div>
        ` : popularAgents.map((agent, i) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="color: ${i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7f32' : '#6b7280'}; font-weight: bold;">#${i + 1}</span>
              <span style="color: #fff;">${agent.name || agent.id}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <span style="color: #ff3366; font-weight: 600;">${agent.launches} launches</span>
              <span style="color: #6b7280; font-size: 0.8rem;">${agent.tasks?.length || 0} tasks</span>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 16px; padding: 12px; background: rgba(99,102,241,0.1); border-radius: 8px; font-size: 0.85rem; color: #818cf8;">
        📊 First activity: ${summary.firstUse ? new Date(summary.firstUse).toLocaleDateString() : 'Never'} • 
        Last activity: ${summary.lastActivity ? new Date(summary.lastActivity).toLocaleString() : 'Never'}
      </div>
      
      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button onclick="Analytics.exportData()" style="padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #9ca3af; cursor: pointer;">📤 Export</button>
        <button onclick="Analytics.clearData()" style="padding: 8px 16px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 6px; color: #ef4444; cursor: pointer;">🗑️ Clear</button>
      </div>
    `;
  },
  
  // Export analytics data
  exportData() {
    const data = this.getData();
    const exportData = {
      exportDate: new Date().toISOString(),
      exportedFrom: 'AIByJob Analytics',
      summary: this.getSummary(),
      data: data
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aibyjob-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // Clear all analytics data
  clearData() {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('📊 Analytics data cleared');
      // Refresh the panel if it exists
      const panel = document.getElementById('analytics-panel');
      if (panel) this.renderAnalyticsPanel('analytics-panel');
    }
  }
};

// Auto-track page views
document.addEventListener('DOMContentLoaded', () => {
  Analytics.trackPageView(window.location.pathname);
});

// Make globally accessible
window.Analytics = Analytics;
