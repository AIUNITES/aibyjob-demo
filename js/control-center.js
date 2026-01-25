// AIByJob Control Center - Functional Agent Management
// Stores task history in localStorage and provides real dashboard

(function() {
  'use strict';
  
  const STORAGE_KEY = 'aibyjob_control_center';
  
  // Initialize or get existing data
  function getData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing control center data:', e);
      }
    }
    return {
      taskHistory: [],
      stats: {
        totalTasks: 0,
        postsGenerated: 0,
        leadsFound: 0,
        sitesBuilt: 0
      }
    };
  }
  
  // Save data
  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  
  // Log a task to history - called from agents
  window.logAgentTask = function(agent, taskType, details, result = {}) {
    const data = getData();
    const task = {
      id: Date.now(),
      agent: agent,
      taskType: taskType,
      details: details,
      result: result,
      timestamp: new Date().toISOString(),
      success: true
    };
    
    data.taskHistory.unshift(task); // Add to beginning
    
    // Keep only last 100 tasks
    if (data.taskHistory.length > 100) {
      data.taskHistory = data.taskHistory.slice(0, 100);
    }
    
    data.stats.totalTasks++;
    
    // Update specific counters
    if (agent === 'Promotion') data.stats.postsGenerated++;
    if (agent === 'LeadFinder') data.stats.leadsFound += (result.leadsCount || 1);
    if (agent === 'WebBuilder') data.stats.sitesBuilt++;
    
    saveData(data);
    updateControlCenter();
    
    console.log('Task logged:', task);
    return task;
  };
  
  // Clear history
  window.clearAgentHistory = function() {
    if (confirm('Are you sure you want to clear all task history? This cannot be undone.')) {
      const data = {
        taskHistory: [],
        stats: {
          totalTasks: 0,
          postsGenerated: 0,
          leadsFound: 0,
          sitesBuilt: 0
        }
      };
      saveData(data);
      updateControlCenter();
      showControlToast('History cleared!', 'success');
    }
  };
  
  // Export history as JSON
  window.exportAgentHistory = function() {
    const data = getData();
    if (data.taskHistory.length === 0) {
      showControlToast('No history to export yet!', 'error');
      return;
    }
    
    const exportData = {
      exportDate: new Date().toISOString(),
      exportedFrom: 'AIByJob Control Center',
      stats: data.stats,
      tasks: data.taskHistory
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aibyjob-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showControlToast('History exported!', 'success');
  };
  
  // Export as CSV
  window.exportAgentHistoryCSV = function() {
    const data = getData();
    if (data.taskHistory.length === 0) {
      showControlToast('No history to export yet!', 'error');
      return;
    }
    
    const headers = ['Date', 'Time', 'Agent', 'Task Type', 'Details', 'Output'];
    const rows = data.taskHistory.map(task => {
      const date = new Date(task.timestamp);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        task.agent,
        task.taskType,
        `"${(task.details || '').replace(/"/g, '""')}"`,
        `"${(task.result?.output || '').substring(0, 200).replace(/"/g, '""')}"`
      ];
    });
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aibyjob-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showControlToast('CSV exported!', 'success');
  };
  
  // Format relative time
  function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }
  
  // Get agent icon
  function getAgentIcon(agent) {
    const icons = {
      'Promotion': '📣',
      'LeadFinder': '🔍',
      'WebBuilder': '🏗️',
      'Marketing': '📈',
      'EcomScout': '🛒'
    };
    return icons[agent] || '🤖';
  }
  
  // Update Control Center UI
  function updateControlCenter() {
    const data = getData();
    
    // Update stats
    const tasksEl = document.getElementById('control-tasks-count');
    const postsEl = document.getElementById('control-posts-count');
    const leadsEl = document.getElementById('control-leads-count');
    
    if (tasksEl) tasksEl.textContent = data.stats.totalTasks;
    if (postsEl) postsEl.textContent = data.stats.postsGenerated;
    if (leadsEl) leadsEl.textContent = data.stats.leadsFound;
    
    // Update history list
    const historyList = document.getElementById('agent-history-list');
    if (historyList) {
      if (data.taskHistory.length === 0) {
        historyList.innerHTML = `
          <div style="text-align: center; padding: 60px 20px; color: #6b7280;">
            <div style="font-size: 3rem; margin-bottom: 16px;">📭</div>
            <h4 style="color: #9ca3af; margin-bottom: 8px;">No tasks yet</h4>
            <p style="font-size: 0.9rem;">Launch an agent to see your history here!</p>
            <a href="agents/promotion.html" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: linear-gradient(135deg, #ff3366, #ff6b6b); color: #fff; border-radius: 8px; text-decoration: none;">📣 Try Promotion Agent</a>
          </div>
        `;
      } else {
        historyList.innerHTML = data.taskHistory.slice(0, 50).map(task => `
          <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 8px; margin-bottom: 8px; border-left: 3px solid ${task.success ? '#10b981' : '#ef4444'};">
            <span style="font-size: 1.5rem; flex-shrink: 0;">${getAgentIcon(task.agent)}</span>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; flex-wrap: wrap; gap: 8px;">
                <span style="color: #fff; font-weight: 600;">${task.agent}</span>
                <span style="color: #6b7280; font-size: 0.8rem;">${timeAgo(task.timestamp)}</span>
              </div>
              <p style="color: #9ca3af; font-size: 0.9rem; margin: 0 0 4px;">${task.taskType}: ${task.details || 'Task completed'}</p>
              ${task.result?.output ? `
                <details style="margin-top: 8px;">
                  <summary style="color: #818cf8; font-size: 0.85rem; cursor: pointer;">View output</summary>
                  <pre style="color: #6b7280; font-size: 0.8rem; margin: 8px 0 0; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; white-space: pre-wrap; word-break: break-word; max-height: 200px; overflow-y: auto;">${escapeHtml(task.result.output)}</pre>
                </details>
              ` : ''}
            </div>
          </div>
        `).join('');
      }
    }
  }
  
  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
  
  // Toast notification
  function showControlToast(message, type = 'success') {
    // Try to use existing toast system first
    if (typeof showToast === 'function') {
      showToast(message, type);
      return;
    }
    
    // Fallback toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 14px 24px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
      color: white;
      border-radius: 10px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    
    // Add animation keyframes if not exists
    if (!document.getElementById('control-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'control-toast-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  // Initialize on page load
  function init() {
    updateControlCenter();
    
    // Update every 30 seconds
    setInterval(updateControlCenter, 30000);
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also update when control view becomes active
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.id === 'control-view' && mutation.target.classList.contains('active')) {
        updateControlCenter();
      }
    });
  });
  
  // Start observing after DOM load
  document.addEventListener('DOMContentLoaded', function() {
    const controlView = document.getElementById('control-view');
    if (controlView) {
      observer.observe(controlView, { attributes: true, attributeFilter: ['class'] });
    }
  });
  
  // Expose update function for manual refresh
  window.refreshControlCenter = updateControlCenter;
  
  // Get stats function for external use
  window.getControlCenterStats = function() {
    return getData().stats;
  };
  
})();
