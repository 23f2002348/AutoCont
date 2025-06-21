export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  progress: number;
  lastActivity: string;
  tasksCompleted: number;
  currentTask?: string;
}

export interface VideoAgent extends Agent {
  type: VideoAgentType;
  videosCreated: number;
  averageDuration: number;
  currentVideoFormat?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  trend_score: number;
  seo_score: number;
  engagement_prediction: number;
  created_at: string;
  updated_at: string;
  content: string;
  metadata: ContentMetadata;
  assignedAgents: string[];
  feedback?: ContentFeedback[];
  videoContent?: VideoContent;
}

export interface ContentFeedback {
  id: string;
  feedback: string;
  timestamp: string;
  status: 'pending' | 'addressed' | 'rejected';
}

export interface VideoContent {
  id: string;
  type: 'reel' | 'video' | 'short';
  duration: number;
  format: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  url?: string;
  thumbnail?: string;
  script?: string;
}

export interface ContentMetadata {
  keywords: string[];
  target_audience: string;
  platform: string[];
  estimated_reach: number;
  trending_topics: string[];
  video_requested?: boolean;
  video_status?: string;
}

export interface SystemMetrics {
  total_content_created: number;
  average_trend_score: number;
  active_agents: number;
  content_pipeline_count: number;
  daily_output: number;
  success_rate: number;
  videos_created: number;
  reels_created: number;
}

export interface GoogleADKConfig {
  api_key: string;
  project_id: string;
  service_account_key: string;
  enabled_services: string[];
}

export type AgentType = 
  | 'researcher' 
  | 'generator' 
  | 'optimizer' 
  | 'publisher' 
  | 'analyzer' 
  | 'coordinator'
  | 'reviewer';

export type VideoAgentType = 
  | 'video_creator'
  | 'reel_creator';

export type AgentStatus = 
  | 'idle' 
  | 'working' 
  | 'completed' 
  | 'error' 
  | 'paused';

export type ContentType = 
  | 'article' 
  | 'social_post' 
  | 'video_script' 
  | 'email' 
  | 'ad_copy' 
  | 'blog_post'
  | 'reel'
  | 'video';

export type ContentStatus = 
  | 'research' 
  | 'generation' 
  | 'optimization' 
  | 'review' 
  | 'approved' 
  | 'published' 
  | 'archived'
  | 'revision_requested';