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
}

export interface ContentMetadata {
  keywords: string[];
  target_audience: string;
  platform: string[];
  estimated_reach: number;
  trending_topics: string[];
}

export interface SystemMetrics {
  total_content_created: number;
  average_trend_score: number;
  active_agents: number;
  content_pipeline_count: number;
  daily_output: number;
  success_rate: number;
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
  | 'coordinator';

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
  | 'blog_post';

export type ContentStatus = 
  | 'research' 
  | 'generation' 
  | 'optimization' 
  | 'review' 
  | 'approved' 
  | 'published' 
  | 'archived';