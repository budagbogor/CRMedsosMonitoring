export type BranchStatus = 'Top' | 'Medium' | 'Attention Required';

export interface ReviewHighlight {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
}

export interface BranchData {
  id: string;
  name: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  mapsUrl?: string;
  rating: number;
  reviewCount: number;
  status: BranchStatus;
  positives: string[];
  negatives: string[];
  complaintCount: number;
  trendScore: 'improving' | 'stable' | 'declining';
  trendDetails?: string;
  recentReviews?: ReviewHighlight[];
}

export interface ComplaintCategoryBreakdown {
  category: string;
  percentage: number;
  count: number;
  severity: 'High' | 'Medium' | 'Low';
  sampleQuotes: string[];
}

export interface HourlyTraffic {
  hour: string;
  trafficLevel: number; // 0 to 100
  label: string;
}

export interface TrafficPattern {
  busyDays: string[];
  peakHours: string;
  quietHours: string;
  hourlyDistribution: HourlyTraffic[];
  summary: string;
  recommendations: string[];
}

export interface SocialChannelData {
  platform: 'Instagram' | 'TikTok' | 'Threads' | 'YouTube' | 'News' | 'Facebook' | 'X/Twitter';
  mentionCount: number;
  sentimentScore: number; // 0 - 100%
  viralTopics: string[];
  recentHeadline: string;
}

export interface CustomerInquiry {
  id: string;
  platform: 'Threads' | 'Instagram' | 'TikTok' | 'Google Reviews' | 'X/Twitter' | 'Facebook';
  author: string;
  authorHandle?: string;
  targetBranch: string;
  date: string;
  questionText: string;
  category: 'Harga & Promo' | 'Booking & Slot' | 'Lokasi & Jam Buka' | 'Stok Sparepart' | 'Layanan General';
  status: 'Unanswered' | 'Responded';
  suggestedAIResponse: string;
}

export interface SocialSentimentData {
  overallPositivePercentage: number;
  overallNeutralPercentage: number;
  overallNegativePercentage: number;
  channels: SocialChannelData[];
  viralComplaints: string[];
  successfulCampaigns: string[];
  publicPerceptionSummary: string;
  customerInquiries?: CustomerInquiry[];
}

export interface StrategicRecommendation {
  id: string;
  priority: 'Critical' | 'High' | 'Medium';
  category: 'Operasional' | 'Pelatihan Staff' | 'Customer Experience' | 'Inventaris & Transparansi';
  title: string;
  description: string;
  targetBranches: string[];
  expectedImpact: string;
  completed?: boolean;
}

export interface FullIntelligenceReport {
  brandName: string;
  analysisDate: string;
  totalBranchesFound: number;
  avgNetworkRating: number;
  totalReviewsAnalyzed: number;
  executiveSummary: string;
  branches: BranchData[];
  redFlagBranchIds: string[];
  complaintCategories: ComplaintCategoryBreakdown[];
  trafficPattern: TrafficPattern;
  socialSentiment: SocialSentimentData;
  strategicRecommendations: StrategicRecommendation[];
  groundingSources?: Array<{ title: string; uri: string }>;
  lastAISyncTimestamp?: string;
}

export type AIProvider = 'gemini' | 'sumopod' | 'openai';

export type AutoSyncPerformanceInterval = 'off' | '15m' | '1h' | '6h' | '24h';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseUrl: string;
  useOrchestration: boolean;
  autoSyncPerformanceInterval?: AutoSyncPerformanceInterval;
  apiKeyScope?: 'global' | 'local';
}

export type AgentStatus = 'idle' | 'working' | 'completed' | 'error';

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  skill: string;
  avatar: string;
  color: string;
  description: string;
}

export interface AgentExecutionState {
  agentId: string;
  status: AgentStatus;
  progressPercent: number;
  outputSnippet?: string;
  executionTimeMs?: number;
  error?: string;
}

export interface SearchState {
  isLoading: boolean;
  step: 'idle' | 'mapping_network' | 'fetching_reviews' | 'analyzing_complaints' | 'tracking_social' | 'synthesizing' | 'completed' | 'error';
  errorMessage?: string;
  progressPercent: number;
}

export interface CSAutomationConfig {
  csEmail: string;
  csEmails?: string[];
  autoSyncEnabled: boolean;
  syncInterval: '15m' | '1h' | '6h' | '24h' | 'realtime';
  monitoredPlatforms: string[];
  targetBusinessUnits: string[];
  targetBrandFocus: string;
  triggers: {
    negativeComplaints: boolean;
    positiveTestimonials: boolean;
    viralMentions: boolean;
  };
  lastSyncTimestamp?: string;
  metaAccessToken?: string;
  tikTokAccessToken?: string;
  googleBusinessApiKey?: string;
  whatsAppAccessToken?: string;
  autoDirectReplyEnabled?: boolean;
  directReplyMode?: 'approval' | 'auto_direct';
}

