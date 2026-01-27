/**
 * AIByJob AI Chat Module
 * Help assistant for AI agents and platform
 */

const AIByJobChat = {
  // Knowledge base for common questions
  knowledge: {
    greeting: [
      "Hi! I'm the AIByJob assistant. I can help you with AI agents, templates, and getting started. What do you need?",
      "Hello! I'm here to help you with AIByJob. Ask me about agents, deployment, or how to get started!"
    ],
    
    topics: {
      'agents': {
        keywords: ['agent', 'agents', 'what are', 'how do agents', 'autonomous'],
        response: `**AI Agents** are autonomous tools that work for you 24/7:

• **WebBuilder** - Creates complete websites from a description
• **Promotion** - Generates social media posts for your products
• **LeadFinder** - Finds businesses without websites
• **EcomScout** - Finds stores without e-commerce
• **MarketingPro** - Handles SEO, social, and email campaigns

Each agent runs autonomously - just give it a task and let it work!`
      },
      
      'webbuilder': {
        keywords: ['webbuilder', 'website', 'build site', 'create website', 'web builder'],
        response: `**WebBuilder Agent** creates complete websites:

1. Go to [WebBuilder Agent](agents/webbuilder.html)
2. Enter your business name and description
3. Choose a style (Modern, Minimal, Bold, Elegant)
4. Click "Build Website"
5. Preview your site and deploy to GitHub Pages

It generates HTML, CSS, and JavaScript automatically!`
      },
      
      'promotion': {
        keywords: ['promotion', 'social media', 'posts', 'linkedin', 'twitter', 'facebook'],
        response: `**Promotion Agent** creates social media content:

1. Go to [Promotion Agent](agents/promotion.html)
2. Select an AIUNITES product to promote
3. Click "Generate Posts"
4. Get ready-to-use posts for LinkedIn, Twitter, and Facebook
5. Copy and paste to your social accounts

Perfect for marketing any AIUNITES product!`
      },
      
      'leadfinder': {
        keywords: ['leadfinder', 'leads', 'find businesses', 'no website', 'prospects'],
        response: `**LeadFinder Agent** discovers business opportunities:

1. Go to [LeadFinder Agent](agents/leadfinder.html)
2. Enter a location (city, state)
3. Choose industry and filters
4. Click "Find Leads"
5. Get a list of businesses without websites

Great for web developers looking for clients!`
      },
      
      'deploy': {
        keywords: ['deploy', 'github', 'publish', 'host', 'live', 'github pages'],
        response: `**Deploying to GitHub Pages:**

1. Build your site with WebBuilder
2. Get a GitHub Personal Access Token:
   - Go to [GitHub Tokens](https://github.com/settings/tokens/new?scopes=repo)
   - Check "repo" scope
   - Generate and copy the token
3. Enter your token and repository name
4. Click "Deploy"

Your site will be live at: \`yourusername.github.io/repo-name\``
      },
      
      'token': {
        keywords: ['token', 'pat', 'personal access', 'ghp_', 'github token'],
        response: `**Creating a GitHub Token:**

1. Go to [GitHub Token Settings](https://github.com/settings/tokens/new?scopes=repo&description=AIByJob%20Deploy)
2. Set an expiration (90 days recommended)
3. Check the **"repo"** checkbox
4. Click "Generate token"
5. Copy the token (starts with \`ghp_\`)

⚠️ Save it somewhere safe - you won't see it again!`
      },
      
      'templates': {
        keywords: ['template', 'templates', 'prompts', 'workflows'],
        response: `**AI Templates** are pre-built prompts by profession:

• **Sales** - Cold emails, proposals, follow-ups
• **Marketing** - Social posts, ad copy, campaigns
• **Developer** - Code reviews, documentation
• **HR** - Job descriptions, interviews

Templates are coming soon! Join the waitlist for early access.`
      },
      
      'director': {
        keywords: ['director', 'control center', 'dashboard', 'manage'],
        response: `**AI Director** is your command center:

• View all agent status at a glance
• Quick launch any agent
• See task history and results
• Export data (CSV, JSON)
• Create agent chains (coming soon)

Access it from the "🎬 Director" tab after logging in.`
      },
      
      'free': {
        keywords: ['free', 'cost', 'price', 'pay', 'pricing'],
        response: `**AIByJob Pricing:**

Currently in **demo/pre-launch** mode - everything is free to try!

When we launch:
• **Free tier** - Basic agents, limited runs
• **Pro tier** - Unlimited agents, priority support
• **Team tier** - Collaboration features

Join the waitlist to lock in early-bird pricing!`
      },
      
      'account': {
        keywords: ['account', 'login', 'signup', 'register', 'password'],
        response: `**Account Help:**

• **Create account** - Click "Get Started Free" or "Sign Up"
• **Login** - Use your username and password
• **Demo mode** - Click "Try Demo" to explore without signing up
• **Forgot password** - Data is stored locally, use "Reset App"

Your data is stored in your browser's localStorage.`
      },
      
      'data': {
        keywords: ['data', 'storage', 'backup', 'privacy', 'local'],
        response: `**Your Data:**

• All data stored locally in your browser
• Nothing sent to external servers
• Use Settings → Backup to download your data
• Use Settings → Restore to import data
• Clear browser data = lose your data

We recommend regular backups!`
      },
      
      'help': {
        keywords: ['help', 'support', 'contact', 'feedback', 'bug'],
        response: `**Getting Help:**

• Check the [Help Page](help.html) for guides and FAQ
• Use the "Help / Feedback" button for issues
• Report bugs on [GitHub Issues](https://github.com/AIUNITES/aibyjob-demo/issues)

This is a demo/preview - some features are simulated!`
      }
    },
    
    fallback: "I'm not sure about that. Try asking about:\n- AI Agents (WebBuilder, Promotion, LeadFinder)\n- Deploying websites\n- Templates and workflows\n- Your account and data\n\nOr visit our [Help page](help.html) for more info!"
  },

  /**
   * Find best matching response
   */
  getResponse(message) {
    const lower = message.toLowerCase();
    
    // Check for greetings
    if (/^(hi|hello|hey|help|start)/.test(lower)) {
      return this.knowledge.greeting[Math.floor(Math.random() * this.knowledge.greeting.length)];
    }
    
    // Search topics
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [topic, data] of Object.entries(this.knowledge.topics)) {
      let score = 0;
      for (const keyword of data.keywords) {
        if (lower.includes(keyword)) {
          score += keyword.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = data.response;
      }
    }
    
    return bestMatch || this.knowledge.fallback;
  },

  /**
   * Format response with markdown-like styling
   */
  formatResponse(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, '<br>');
  },

  /**
   * Initialize chat UI
   */
  init() {
    this.container = document.getElementById('ai-chat-container');
    this.messages = document.getElementById('ai-chat-messages');
    this.input = document.getElementById('ai-chat-input');
    this.sendBtn = document.getElementById('ai-chat-send');
    this.toggleBtn = document.getElementById('ai-chat-toggle');
    
    if (!this.container) return;
    
    this.toggleBtn?.addEventListener('click', () => this.toggle());
    this.sendBtn?.addEventListener('click', () => this.send());
    this.input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });
    
    document.getElementById('ai-chat-close')?.addEventListener('click', () => this.close());
    
    document.querySelectorAll('.ai-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.input.value = btn.dataset.question;
        this.send();
      });
    });
  },

  toggle() {
    this.container.classList.toggle('open');
    if (this.container.classList.contains('open')) {
      this.input?.focus();
      if (this.messages && this.messages.children.length === 0) {
        this.addMessage(this.knowledge.greeting[0], 'ai');
      }
    }
  },

  close() {
    this.container.classList.remove('open');
  },

  send() {
    const text = this.input?.value.trim();
    if (!text) return;
    
    this.addMessage(text, 'user');
    this.input.value = '';
    
    this.showTyping();
    
    setTimeout(() => {
      this.hideTyping();
      const response = this.getResponse(text);
      this.addMessage(response, 'ai');
    }, 500 + Math.random() * 500);
  },

  addMessage(text, type) {
    if (!this.messages) return;
    
    const div = document.createElement('div');
    div.className = `ai-message ai-message-${type}`;
    div.innerHTML = type === 'ai' ? this.formatResponse(text) : text;
    this.messages.appendChild(div);
    this.messages.scrollTop = this.messages.scrollHeight;
  },

  showTyping() {
    if (!this.messages) return;
    const div = document.createElement('div');
    div.className = 'ai-message ai-message-ai ai-typing';
    div.id = 'ai-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    this.messages.appendChild(div);
    this.messages.scrollTop = this.messages.scrollHeight;
  },

  hideTyping() {
    document.getElementById('ai-typing')?.remove();
  }
};

document.addEventListener('DOMContentLoaded', () => AIByJobChat.init());
