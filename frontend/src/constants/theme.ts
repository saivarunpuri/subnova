/* =====================================================
   AURORA ECLIPSE — Category Color System
   Each category has its own atmospheric identity
   ===================================================== */

export interface CategoryColor {
  themeColor: string; // Hex color
  glowColor: string;  // rgba or hex
  colorName: string;  // Tailwind color name
  gradient: string;   // Aurora gradient for this category
}

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  // 🎬 Entertainment — Lava Coral + Gold  (cinematic fire)
  entertainment: {
    themeColor: '#FF6B6B',
    glowColor: 'rgba(255,107,107,0.22)',
    colorName: 'rose',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #f472b6 100%)',
  },
  // 📚 Education — Electric Blue + Aurora Green (knowledge & clarity)
  education: {
    themeColor: '#00D9F5',
    glowColor: 'rgba(0,217,245,0.22)',
    colorName: 'cyan',
    gradient: 'linear-gradient(135deg, #00D9F5 0%, #00F5A0 100%)',
  },
  // 🎨 Creator — Coral + Pink glow (creative fire)
  creator: {
    themeColor: '#FF6B6B',
    glowColor: 'rgba(255,107,107,0.22)',
    colorName: 'pink',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #f472b6 100%)',
  },
  // 🎵 Music — Aurora Green + Cyan pulse (sonic waves)
  music: {
    themeColor: '#00F5A0',
    glowColor: 'rgba(0,245,160,0.22)',
    colorName: 'emerald',
    gradient: 'linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)',
  },
  // 💼 Productivity — Cosmic Gold + Electric Blue (focus energy)
  productivity: {
    themeColor: '#A78BFA',
    glowColor: 'rgba(167,139,250,0.22)',
    colorName: 'violet',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #00D9F5 100%)',
  },
  // 🚀 Discover — Aurora spectrum (the hub)
  discover: {
    themeColor: '#F8FAFC',
    glowColor: 'rgba(255,255,255,0.12)',
    colorName: 'white',
    gradient: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 45%, #FF6B6B 75%, #A78BFA 100%)',
  },
  // ✅ Success states
  success: {
    themeColor: '#00F5A0',
    glowColor: 'rgba(0,245,160,0.22)',
    colorName: 'emerald',
    gradient: 'linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)',
  },
  // ❌ Error states
  error: {
    themeColor: '#FF6B6B',
    glowColor: 'rgba(255,107,107,0.25)',
    colorName: 'rose',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #f43f5e 100%)',
  },
  // ℹ️ Info states
  info: {
    themeColor: '#00D9F5',
    glowColor: 'rgba(0,217,245,0.22)',
    colorName: 'cyan',
    gradient: 'linear-gradient(135deg, #00D9F5 0%, #00F5A0 100%)',
  },
  // 📊 Analytics — Full aurora spectrum
  analytics: {
    themeColor: '#00F5A0',
    glowColor: 'rgba(0,245,160,0.22)',
    colorName: 'emerald',
    gradient: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 50%, #FF6B6B 100%)',
  },
  // 📋 Dashboard — Electric Blue
  dashboard: {
    themeColor: '#00D9F5',
    glowColor: 'rgba(0,217,245,0.22)',
    colorName: 'cyan',
    gradient: 'linear-gradient(135deg, #00D9F5 0%, #00F5A0 100%)',
  },
};

export const DEFAULT_CATEGORY_COLOR: CategoryColor = {
  themeColor: '#F8FAFC',
  glowColor: 'rgba(255,255,255,0.12)',
  colorName: 'white',
  gradient: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 45%, #FF6B6B 75%, #A78BFA 100%)',
};

// Signature Aurora Eclipse gradient
export const AURORA_GRADIENT = 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 45%, #FF6B6B 75%, #A78BFA 100%)';

export const GLOBAL_STRINGS = {
  // Application details
  appName: 'SUBNOVA',
  tagline: 'Stellar Subscription Universe',
  
  // Navigation & Control Center headings
  controlCenter: 'Control Center',
  controlCenterDesc: 'Real-time system statistics and dynamic service management.',
  welcomeBack: 'Welcome back, Space Explorer',
  welcomeDesc: 'Here is your subscription universe at a glance.',
  
  // Category Labels
  discover: 'Discover',
  entertainment: 'Entertainment',
  education: 'Education',
  creator: 'Creator',
  music: 'Music',
  productivity: 'Productivity',
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  overview: 'Overview',
  brands: 'Channels / Brands',
  packs: 'Service Packs',

  // Statuses & Warnings
  noActiveServices: 'No active services are registered.',
  noActiveServicesDesc: 'Click the registration button above to initialize the first node.',
  noChannelsMatch: 'No channels match your query.',
  noChannelsMatchDesc: 'Try adjusting your search terms or category sphere filter.',
  confirmDissolution: 'Confirm Dissolution',
  confirmDissolutionDesc: 'Are you sure you want to permanently dissolve the channel and purge all of its associated service packs from the Subscription Universe?',
  confirmPlanDeletion: 'Confirm Plan Deletion',
  confirmPlanDeletionDesc: 'Are you sure you want to permanently dissolve the tier from the stack?',

  // UI labels used in AnalyticsSpace.tsx
  liveNode: 'Live Node',
  disconnectProfile: 'Disconnect Profile',
  nodeSecurity: 'Node Security',
  status: 'Status',
  active: 'Active',
  sslGated: 'SSL-GATED',
  registerNewChannel: 'Register New Channel',
  loadingChannels: 'Retrieving channels layout...',
  searchPlaceholder: 'Search channels...',
  filterSpaceLabel: 'Filter Space:',
  allSpheres: 'All Spheres',
  logoPreview: 'Logo Preview',
  untitledChannel: 'Untitled Channel',
  channelNameLabel: 'Channel Name',
  channelNamePlaceholder: 'e.g. Netflix, Prime Video',
  categoryLabel: 'Planetary Space Category',
  logoUrlLabel: 'Logo URL (Optional)',
  logoUrlPlaceholder: 'e.g. https://domain.com/logo.png',
  descriptionLabel: 'Short Tagline / Description',
  descriptionPlaceholder: 'Summarize this service provider for users...',
  cancel: 'Cancel / Return',
  initializeChannel: 'Initialize Channel',
  applyChanges: 'Apply Changes',
  modifyChannel: 'Modify OTT Channel',
  definePortalNodes: 'Define new portal nodes and streaming dimensions.',
  
  // Service Packs Specific Strings
  configureServicePack: 'Configure Service Pack',
  modifyServicePack: 'Modify Service Pack',
  parentBrandLabel: 'Parent Brand',
  selectBrandPlaceholder: 'Select OTT Brand...',
  packTitleLabel: 'Pack Title',
  packTitlePlaceholder: 'e.g. Standard Mobile, Ultra Premium',
  discountedPriceLabel: 'Discounted Price (₹)',
  originalPriceLabel: 'Original Price (₹)',
  validityPeriodLabel: 'Validity Period',
  validityPeriodPlaceholder: 'e.g. 30 Days, 3 Months, 1 Year',
  featuresLabel: 'Features (Comma-separated)',
  featuresPlaceholder: 'e.g. 1080p, Ads-free, 2 Screens, Mobile+PC',
  featuresDescription: 'Separate each product highlight with a comma.',
  briefPackDescriptionLabel: 'Brief Pack Description',
  briefPackDescriptionPlaceholder: 'e.g. Best for standard single user streaming.',
  publishPlan: 'Publish Plan',
  updatePlan: 'Update Plan',
  activeServicePlans: 'Active Service Plans',
  filterByBrandLabel: 'Filter by Brand:',
  allBrandsOption: 'All Brands',
  noPacksFound: 'No subscription packs found for the selected filter. Create one using the form on the left.',
  editPackTitle: 'Edit Pack',
  deletePackTitle: 'Delete Pack',
  editBrandTitle: 'Edit Brand',
  deleteBrandTitle: 'Delete Brand',
  keepActive: 'Keep Active',
  keepPlan: 'Keep Plan',
  confirmPurge: 'Confirm Purge',
  totalRevenueLabel: 'Total Platform Revenue',
  activeSubscribersLabel: 'Active Subscribers',
  dynamicBrandsLabel: 'Dynamic Brands',
  configuredPacksLabel: 'Configured Packs',
  systemsOnlineLabel: 'Interactive Diagnostic Systems Online',
  systemsOnlineDesc: 'Use the sidebar mapping to view structural components. Navigate to "Channels" or "Packs" tabs above to populate dynamic platform assets in real-time.',
  registeredSectorChannels: 'Registered Sector Channels',
  configureActiveBrandNodes: 'Configure active brand nodes and content provider spaces.',
  channelDissolved: 'Channel Dissolved',
  dissolutionFailed: 'Dissolution Failed',
  servicePlanUpdated: 'Service Plan Updated',
  servicePlanPublished: 'Service Plan Published',
  servicePlanPurged: 'Service Plan Purged',
  purgeFailed: 'Purge Failed',
  channelUpdated: 'Channel Updated',
  channelRegistered: 'Channel Registered',
  actionFailed: 'Action Failed',
  allActiveSubscriptionPacksDeleted: 'All active subscription packs will be deleted',
  usersWillLoseAccess: 'Users will lose access to dynamic activations',
  actionIsCompletelyIrreversible: 'This action is completely irreversible',
  planRate: 'Plan Rate',
  tierInstantlyWithdrawn: 'This tier will be instantly withdrawn from sale',
  activeSubscriberTokensRemainValid: 'Active subscriber tokens remain valid until expiration'
};
