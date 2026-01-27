/**
 * AIByJob Configuration
 * AI Tools Organized by Profession
 */

const APP_CONFIG = {
  // ============================================
  // BASIC APP INFO
  // ============================================
  name: 'AIByJob',
  tagline: 'The Right AI for Your Job',
  description: 'Discover the best AI tools for your profession. Curated recommendations for every career.',
  icon: '💼',
  version: '1.4.0',
  
  logoHtml: 'AI<span>ByJob</span>',
  headline: 'Find AI Tools<br><span class="gradient-text">For Your Job.</span>',
  
  ctaHeadline: 'Ready to supercharge your career?',
  ctaDescription: 'Browse AI tools curated for your profession.',

  // ============================================
  // STORAGE KEYS
  // ============================================
  storagePrefix: 'aibyjob',
  
  // ============================================
  // ITEM CONFIGURATION
  // ============================================
  itemName: 'tool',
  itemNamePlural: 'tools',
  
  emptyIcon: '🔧',
  emptyTitle: 'No saved tools yet',
  emptyDescription: 'Save AI tools you want to remember',
  newItemButtonText: 'Add Tool',

  // ============================================
  // LANDING PAGE SECTIONS
  // ============================================
  itemsSectionTitle: '🔥 Trending AI Tools',
  itemsSectionSubtitle: 'Popular picks across all professions',
  
  heroCards: [
    { icon: '👨‍⚕️', name: 'Healthcare', subtitle: '🏥 Coming Soon', color: '#10b981' },
    { icon: '📊', name: 'Finance', subtitle: '💰 Coming Soon', color: '#3b82f6' },
    { icon: '💻', name: 'Developers', subtitle: '⚡ Coming Soon', color: '#8b5cf6' }
  ],
  
  features: [
    { icon: '🎯', title: 'Find Your Niche', description: 'Browse tools organized by profession and use case' },
    { icon: '⭐', title: 'Curated Reviews', description: 'Real ratings from professionals in your field' },
    { icon: '💰', title: 'Compare Pricing', description: 'See free vs paid options at a glance' },
    { icon: '📚', title: 'Learning Resources', description: 'Tutorials and guides to get started fast' }
  ],

  // ============================================
  // USER STATS
  // ============================================
  stats: [
    { id: 'saved', label: 'Saved Tools', getValue: (items) => items.length },
    { id: 'tried', label: 'Tried', getValue: (items) => items.filter(i => i.status === 'tried').length },
    { id: 'favorites', label: 'Favorites', getValue: (items) => items.filter(i => i.favorite).length }
  ],

  // ============================================
  // ITEM FIELDS
  // ============================================
  itemFields: [
    { 
      id: 'name', 
      label: 'Tool Name', 
      type: 'text', 
      placeholder: 'e.g., ChatGPT, Midjourney',
      required: true 
    },
    { 
      id: 'description', 
      label: 'What it does', 
      type: 'textarea', 
      placeholder: 'How does this tool help your work?',
      required: false 
    },
    { 
      id: 'url', 
      label: 'Website URL', 
      type: 'text', 
      placeholder: 'https://...',
      required: false 
    },
    { 
      id: 'profession', 
      label: 'Best For', 
      type: 'select',
      options: [
        { value: 'general', label: '🌐 General / All Jobs' },
        { value: 'developer', label: '💻 Developers & Engineers' },
        { value: 'marketer', label: '📣 Marketers & Content' },
        { value: 'designer', label: '🎨 Designers & Creatives' },
        { value: 'finance', label: '📊 Finance & Accounting' },
        { value: 'healthcare', label: '👨‍⚕️ Healthcare' },
        { value: 'legal', label: '⚖️ Legal' },
        { value: 'sales', label: '🤝 Sales & Business' },
        { value: 'hr', label: '👥 HR & Recruiting' },
        { value: 'education', label: '📚 Education' },
        { value: 'realestate', label: '🏠 Real Estate' },
        { value: 'other', label: '🔧 Other' }
      ],
      required: false 
    },
    { 
      id: 'pricing', 
      label: 'Pricing', 
      type: 'select',
      options: [
        { value: 'free', label: '🆓 Free' },
        { value: 'freemium', label: '🎁 Freemium' },
        { value: 'paid', label: '💳 Paid' },
        { value: 'enterprise', label: '🏢 Enterprise' }
      ],
      required: false 
    },
    { 
      id: 'status', 
      label: 'Your Status', 
      type: 'select',
      options: [
        { value: 'saved', label: '📌 Saved for Later' },
        { value: 'trying', label: '🔄 Currently Trying' },
        { value: 'tried', label: '✅ Tried It' },
        { value: 'using', label: '⭐ Using Regularly' }
      ],
      required: false 
    },
    {
      id: 'icon',
      label: 'Icon',
      type: 'iconPicker',
      options: ['🤖', '💬', '🎨', '📝', '📊', '🔍', '🎯', '⚡', '🧠', '🔮', '📈', '🛠️'],
      default: '🤖'
    },
    {
      id: 'color',
      label: 'Color',
      type: 'colorPicker',
      options: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'],
      default: '#3b82f6'
    }
  ],

  // ============================================
  // DISCOVER SECTION - FEATURED AI TOOLS
  // ============================================
  discoverItems: [
    { 
      name: 'Claude', 
      icon: '🧠', 
      color: '#d97706', 
      description: 'Advanced AI assistant for writing, analysis, and coding'
    },
    { 
      name: 'ChatGPT', 
      icon: '💬', 
      color: '#10b981', 
      description: 'Conversational AI for brainstorming, writing, and problem-solving'
    },
    { 
      name: 'Midjourney', 
      icon: '🎨', 
      color: '#8b5cf6', 
      description: 'AI image generation from text prompts'
    },
    { 
      name: 'GitHub Copilot', 
      icon: '💻', 
      color: '#3b82f6', 
      description: 'AI pair programmer for code completion and suggestions'
    },
    { 
      name: 'Notion AI', 
      icon: '📝', 
      color: '#1a1a1a', 
      description: 'AI writing assistant built into Notion workspace'
    },
    { 
      name: 'Perplexity', 
      icon: '🔍', 
      color: '#06b6d4', 
      description: 'AI-powered search engine with cited sources'
    }
  ],

  // ============================================
  // DEFAULT USERS
  // ============================================
  defaultAdmin: {
    username: 'admin',
    password: 'admin123',
    displayName: 'Administrator',
    email: 'admin@aibyjob.com',
    isAdmin: true
  },
  
  defaultDemo: {
    username: 'demo',
    password: 'demo123',
    displayName: 'Demo User',
    email: 'demo@aibyjob.com',
    isAdmin: false
  },

  // ============================================
  // DEMO CONTENT
  // ============================================
  demoItems: [
    {
      name: 'Claude',
      description: 'My go-to for complex analysis and long-form writing. Better than ChatGPT for nuanced tasks.',
      url: 'https://claude.ai',
      profession: 'general',
      pricing: 'freemium',
      status: 'using',
      icon: '🧠',
      color: '#d97706'
    },
    {
      name: 'Cursor',
      description: 'AI-powered code editor. Game changer for development workflow.',
      url: 'https://cursor.sh',
      profession: 'developer',
      pricing: 'freemium',
      status: 'using',
      icon: '💻',
      color: '#3b82f6'
    },
    {
      name: 'Jasper',
      description: 'Great for marketing copy and blog posts. Saves hours on content.',
      url: 'https://jasper.ai',
      profession: 'marketer',
      pricing: 'paid',
      status: 'tried',
      icon: '📣',
      color: '#ec4899'
    },
    {
      name: 'Harvey AI',
      description: 'Legal AI assistant. Want to try for contract review.',
      url: 'https://harvey.ai',
      profession: 'legal',
      pricing: 'enterprise',
      status: 'saved',
      icon: '⚖️',
      color: '#8b5cf6'
    },
    {
      name: 'Fireflies.ai',
      description: 'AI meeting notes and transcription. Perfect for client calls.',
      url: 'https://fireflies.ai',
      profession: 'sales',
      pricing: 'freemium',
      status: 'trying',
      icon: '🎙️',
      color: '#f59e0b'
    }
  ],

  // ============================================
  // THEME COLORS
  // ============================================
  theme: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    gradient1: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    gradient2: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  },

  // ============================================
  // CUSTOM RENDER (optional)
  // ============================================
  renderItemCard: null,
  renderItemDetail: null,
  validateItem: null,
  onItemCreated: null,
  onItemDeleted: null,

  // ============================================
  // CHANGELOG (shown in admin panel)
  // ============================================
  changelog: [
    {
      version: 'v1.0.0',
      date: 'January 2026',
      changes: [
        'Initial release',
        'AI tool discovery by profession',
        'Save and organize tools',
        'Status tracking (saved, trying, using)',
        'Admin panel with changelog',
        'Terms of Service and Privacy Policy'
      ]
    }
  ]
};

window.APP_CONFIG = APP_CONFIG;
