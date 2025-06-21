import { Agent, ContentItem, AgentStatus, ContentStatus, VideoAgent, ContentFeedback, VideoContent } from '../types';
import { googleADK } from './googleADK';

class AgentSystemService {
  private agents: Map<string, Agent> = new Map();
  private videoAgents: Map<string, VideoAgent> = new Map();
  private contentQueue: ContentItem[] = [];
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeAgents();
    this.initializeVideoAgents();
    this.startAgentOrchestration();
  }

  private initializeAgents() {
    const agentConfigs = [
      { id: 'researcher-01', name: 'Trend Researcher', type: 'researcher' as const },
      { id: 'generator-01', name: 'Content Generator', type: 'generator' as const },
      { id: 'generator-02', name: 'Creative Writer', type: 'generator' as const },
      { id: 'optimizer-01', name: 'SEO Optimizer', type: 'optimizer' as const },
      { id: 'publisher-01', name: 'Content Publisher', type: 'publisher' as const },
      { id: 'analyzer-01', name: 'Performance Analyzer', type: 'analyzer' as const },
      { id: 'coordinator-01', name: 'System Coordinator', type: 'coordinator' as const },
      { id: 'reviewer-01', name: 'Content Reviewer', type: 'reviewer' as const },
    ];

    agentConfigs.forEach(config => {
      const agent: Agent = {
        ...config,
        status: 'idle',
        progress: 0,
        lastActivity: new Date().toISOString(),
        tasksCompleted: Math.floor(Math.random() * 50),
        currentTask: undefined
      };
      this.agents.set(agent.id, agent);
    });
  }

  private initializeVideoAgents() {
    const videoAgentConfigs = [
      { id: 'video-creator-01', name: 'Video Creator Pro', type: 'video_creator' as const },
      { id: 'reel-creator-01', name: 'Reel Master', type: 'reel_creator' as const },
      { id: 'reel-creator-02', name: 'Short Form Specialist', type: 'reel_creator' as const },
    ];

    videoAgentConfigs.forEach(config => {
      const agent: VideoAgent = {
        ...config,
        status: 'idle',
        progress: 0,
        lastActivity: new Date().toISOString(),
        tasksCompleted: Math.floor(Math.random() * 30),
        currentTask: undefined,
        videosCreated: Math.floor(Math.random() * 25),
        averageDuration: config.type === 'video_creator' ? Math.floor(Math.random() * 300) + 60 : Math.floor(Math.random() * 60) + 15,
        currentVideoFormat: undefined
      };
      this.videoAgents.set(agent.id, agent);
    });
  }

  private async startAgentOrchestration() {
    // Simulate autonomous agent behavior
    setInterval(() => {
      this.agents.forEach(agent => {
        if (Math.random() < 0.3) { // 30% chance to change status
          this.simulateAgentActivity(agent);
        }
      });

      this.videoAgents.forEach(agent => {
        if (Math.random() < 0.25) { // 25% chance to change status
          this.simulateVideoAgentActivity(agent);
        }
      });
    }, 5000);

    // Start content creation workflow
    this.startContentCreationWorkflow();
  }

  private async startContentCreationWorkflow() {
    setInterval(async () => {
      try {
        // Research agent finds trending topics
        const researchAgent = Array.from(this.agents.values()).find(a => a.type === 'researcher');
        if (researchAgent && researchAgent.status === 'idle') {
          await this.executeResearchTask(researchAgent);
        }

        // Process content queue
        if (this.contentQueue.length > 0) {
          await this.processContentQueue();
        }

        // Process video requests
        await this.processVideoRequests();
      } catch (error) {
        console.error('Content creation workflow error:', error);
      }
    }, 10000);
  }

  private async executeResearchTask(agent: Agent) {
    this.updateAgentStatus(agent.id, 'working', 'Analyzing trending topics...');
    
    try {
      const trends = await googleADK.getTrendingTopics();
      
      // Create content items based on trends
      trends.slice(0, 2).forEach(trend => {
        const contentItem: ContentItem = {
          id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `${trend.keyword}: The Ultimate Guide`,
          type: 'article',
          status: 'research',
          trend_score: parseInt(trend.growth.replace(/[+%]/g, '')),
          seo_score: 0,
          engagement_prediction: Math.floor(Math.random() * 100),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          content: '',
          metadata: {
            keywords: [trend.keyword],
            target_audience: 'general',
            platform: ['blog', 'social'],
            estimated_reach: trend.volume,
            trending_topics: [trend.keyword]
          },
          assignedAgents: [agent.id],
          feedback: []
        };
        
        this.contentQueue.push(contentItem);
      });

      this.updateAgentStatus(agent.id, 'completed', 'Research completed');
      agent.tasksCompleted++;
      
      this.emit('contentAdded', this.contentQueue.slice(-2));
    } catch (error) {
      this.updateAgentStatus(agent.id, 'error', 'Research failed');
    }
  }

  private async processContentQueue() {
    const item = this.contentQueue.find(item => 
      item.status === 'research' || 
      item.status === 'generation' || 
      item.status === 'optimization' ||
      item.status === 'revision_requested'
    );

    if (!item) return;

    switch (item.status) {
      case 'research':
        await this.processGeneration(item);
        break;
      case 'generation':
        await this.processOptimization(item);
        break;
      case 'optimization':
        await this.processReview(item);
        break;
      case 'revision_requested':
        await this.processRevision(item);
        break;
    }
  }

  private async processGeneration(item: ContentItem) {
    const generatorAgent = Array.from(this.agents.values()).find(
      a => a.type === 'generator' && a.status === 'idle'
    );

    if (!generatorAgent) return;

    this.updateAgentStatus(generatorAgent.id, 'working', `Generating: ${item.title}`);
    
    try {
      const prompt = `Create engaging ${item.type} content about ${item.metadata.keywords.join(', ')} targeting ${item.metadata.target_audience}. Make it comprehensive, actionable, and trending.`;
      const result = await googleADK.generateContent(prompt, item.type);
      
      item.content = result.content;
      item.status = 'generation';
      item.updated_at = new Date().toISOString();
      item.assignedAgents.push(generatorAgent.id);

      this.updateAgentStatus(generatorAgent.id, 'completed', 'Content generated');
      generatorAgent.tasksCompleted++;
      
      this.emit('contentUpdated', item);
    } catch (error) {
      this.updateAgentStatus(generatorAgent.id, 'error', 'Generation failed');
    }
  }

  private async processOptimization(item: ContentItem) {
    const optimizerAgent = Array.from(this.agents.values()).find(
      a => a.type === 'optimizer' && a.status === 'idle'
    );

    if (!optimizerAgent) return;

    this.updateAgentStatus(optimizerAgent.id, 'working', `Optimizing: ${item.title}`);
    
    try {
      // Simulate SEO optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      item.seo_score = Math.floor(Math.random() * 40) + 60;
      item.status = 'optimization';
      item.updated_at = new Date().toISOString();
      item.assignedAgents.push(optimizerAgent.id);

      this.updateAgentStatus(optimizerAgent.id, 'completed', 'Optimization completed');
      optimizerAgent.tasksCompleted++;
      
      this.emit('contentUpdated', item);
    } catch (error) {
      this.updateAgentStatus(optimizerAgent.id, 'error', 'Optimization failed');
    }
  }

  private async processReview(item: ContentItem) {
    const reviewerAgent = Array.from(this.agents.values()).find(
      a => a.type === 'reviewer' && a.status === 'idle'
    );

    if (!reviewerAgent) return;

    this.updateAgentStatus(reviewerAgent.id, 'working', `Reviewing: ${item.title}`);
    
    try {
      // Simulate review process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      item.status = 'review';
      item.updated_at = new Date().toISOString();
      item.assignedAgents.push(reviewerAgent.id);

      this.updateAgentStatus(reviewerAgent.id, 'completed', 'Review completed');
      reviewerAgent.tasksCompleted++;
      
      this.emit('contentUpdated', item);
    } catch (error) {
      this.updateAgentStatus(reviewerAgent.id, 'error', 'Review failed');
    }
  }

  private async processRevision(item: ContentItem) {
    const generatorAgent = Array.from(this.agents.values()).find(
      a => a.type === 'generator' && a.status === 'idle'
    );

    if (!generatorAgent) return;

    this.updateAgentStatus(generatorAgent.id, 'working', `Revising: ${item.title}`);
    
    try {
      const latestFeedback = item.feedback?.[item.feedback.length - 1];
      const prompt = `Revise this content based on feedback: "${latestFeedback?.feedback}". Original content: ${item.content}`;
      const result = await googleADK.generateContent(prompt, item.type);
      
      item.content = result.content;
      item.status = 'generation';
      item.updated_at = new Date().toISOString();
      
      // Mark feedback as addressed
      if (latestFeedback) {
        latestFeedback.status = 'addressed';
      }

      this.updateAgentStatus(generatorAgent.id, 'completed', 'Revision completed');
      generatorAgent.tasksCompleted++;
      
      this.emit('contentUpdated', item);
    } catch (error) {
      this.updateAgentStatus(generatorAgent.id, 'error', 'Revision failed');
    }
  }

  private async processVideoRequests() {
    const videoRequests = this.contentQueue.filter(item => 
      item.metadata.video_requested && item.metadata.video_status === 'pending'
    );

    for (const item of videoRequests) {
      await this.createVideoContent(item);
    }
  }

  private async createVideoContent(item: ContentItem) {
    const videoAgent = Array.from(this.videoAgents.values()).find(
      a => a.status === 'idle'
    );

    if (!videoAgent) return;

    const videoType = videoAgent.type === 'reel_creator' ? 'reel' : 'video';
    this.updateVideoAgentStatus(videoAgent.id, 'working', `Creating ${videoType} for: ${item.title}`);
    
    try {
      // Simulate video creation
      const duration = videoAgent.type === 'reel_creator' ? 
        Math.floor(Math.random() * 45) + 15 : // 15-60 seconds for reels
        Math.floor(Math.random() * 240) + 60; // 1-5 minutes for videos

      videoAgent.currentVideoFormat = videoType === 'reel' ? 'MP4 (9:16)' : 'MP4 (16:9)';
      
      await new Promise(resolve => setTimeout(resolve, 5000));

      const videoContent: VideoContent = {
        id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: videoType as 'reel' | 'video',
        duration,
        format: videoAgent.currentVideoFormat,
        status: 'completed',
        script: `Video script based on: ${item.content.substring(0, 200)}...`,
        thumbnail: `https://picsum.photos/400/600?random=${Math.random()}`
      };

      item.videoContent = videoContent;
      item.metadata.video_status = 'completed';
      item.updated_at = new Date().toISOString();

      videoAgent.videosCreated++;
      videoAgent.averageDuration = Math.floor((videoAgent.averageDuration + duration) / 2);

      this.updateVideoAgentStatus(videoAgent.id, 'completed', `${videoType} created successfully`);
      videoAgent.tasksCompleted++;
      
      this.emit('contentUpdated', item);
    } catch (error) {
      this.updateVideoAgentStatus(videoAgent.id, 'error', 'Video creation failed');
      if (item.metadata.video_status) {
        item.metadata.video_status = 'failed';
      }
    }
  }

  private simulateAgentActivity(agent: Agent) {
    const statuses: AgentStatus[] = ['idle', 'working', 'completed'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (newStatus === 'working') {
      agent.progress = Math.floor(Math.random() * 100);
      agent.currentTask = this.getRandomTask(agent.type);
    } else {
      agent.progress = newStatus === 'completed' ? 100 : 0;
      agent.currentTask = undefined;
    }

    this.updateAgentStatus(agent.id, newStatus);
  }

  private simulateVideoAgentActivity(agent: VideoAgent) {
    const statuses: AgentStatus[] = ['idle', 'working', 'completed'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (newStatus === 'working') {
      agent.progress = Math.floor(Math.random() * 100);
      agent.currentTask = this.getRandomVideoTask(agent.type);
      agent.currentVideoFormat = agent.type === 'reel_creator' ? 'MP4 (9:16)' : 'MP4 (16:9)';
    } else {
      agent.progress = newStatus === 'completed' ? 100 : 0;
      agent.currentTask = undefined;
      agent.currentVideoFormat = undefined;
    }

    this.updateVideoAgentStatus(agent.id, newStatus);
  }

  private getRandomTask(agentType: string): string {
    const tasks = {
      researcher: ['Analyzing trending topics', 'Gathering market insights', 'Competitor analysis'],
      generator: ['Creating content draft', 'Writing engaging copy', 'Developing storyline'],
      optimizer: ['Optimizing for SEO', 'Improving readability', 'Enhancing keywords'],
      publisher: ['Publishing to platforms', 'Scheduling posts', 'Managing distribution'],
      analyzer: ['Analyzing performance', 'Generating reports', 'Tracking metrics'],
      coordinator: ['Orchestrating workflow', 'Managing agent tasks', 'System monitoring'],
      reviewer: ['Quality checking content', 'Reviewing for compliance', 'Fact-checking information']
    };

    const taskList = tasks[agentType as keyof typeof tasks] || ['Processing task'];
    return taskList[Math.floor(Math.random() * taskList.length)];
  }

  private getRandomVideoTask(agentType: string): string {
    const tasks = {
      video_creator: ['Creating video script', 'Generating video content', 'Adding visual effects', 'Editing video timeline'],
      reel_creator: ['Creating short-form content', 'Adding trending music', 'Optimizing for engagement', 'Creating viral hooks']
    };

    const taskList = tasks[agentType as keyof typeof tasks] || ['Creating video content'];
    return taskList[Math.floor(Math.random() * taskList.length)];
  }

  private updateAgentStatus(agentId: string, status: AgentStatus, currentTask?: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastActivity = new Date().toISOString();
      if (currentTask) agent.currentTask = currentTask;
      this.emit('agentUpdated', agent);
    }
  }

  private updateVideoAgentStatus(agentId: string, status: AgentStatus, currentTask?: string) {
    const agent = this.videoAgents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastActivity = new Date().toISOString();
      if (currentTask) agent.currentTask = currentTask;
      this.emit('videoAgentUpdated', agent);
    }
  }

  // Event system for real-time updates
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Public methods
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getVideoAgents(): VideoAgent[] {
    return Array.from(this.videoAgents.values());
  }

  getContentQueue(): ContentItem[] {
    return this.contentQueue;
  }

  pauseAgent(agentId: string) {
    if (this.agents.has(agentId)) {
      this.updateAgentStatus(agentId, 'paused', 'Paused by user');
    } else if (this.videoAgents.has(agentId)) {
      this.updateVideoAgentStatus(agentId, 'paused', 'Paused by user');
    }
  }

  resumeAgent(agentId: string) {
    if (this.agents.has(agentId)) {
      this.updateAgentStatus(agentId, 'idle');
    } else if (this.videoAgents.has(agentId)) {
      this.updateVideoAgentStatus(agentId, 'idle');
    }
  }

  updateContent(contentId: string, updates: Partial<ContentItem>) {
    const contentIndex = this.contentQueue.findIndex(item => item.id === contentId);
    if (contentIndex !== -1) {
      this.contentQueue[contentIndex] = { ...this.contentQueue[contentIndex], ...updates };
      this.emit('contentUpdated', this.contentQueue[contentIndex]);
    }
  }

  requestRevision(contentId: string, feedback: string) {
    const content = this.contentQueue.find(item => item.id === contentId);
    if (content) {
      const feedbackItem: ContentFeedback = {
        id: `feedback-${Date.now()}`,
        feedback,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      if (!content.feedback) content.feedback = [];
      content.feedback.push(feedbackItem);
      content.status = 'revision_requested';
      content.updated_at = new Date().toISOString();

      this.emit('contentUpdated', content);
    }
  }
}

export const agentSystem = new AgentSystemService();