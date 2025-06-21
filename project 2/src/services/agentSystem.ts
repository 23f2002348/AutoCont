import { Agent, ContentItem, AgentStatus, ContentStatus } from '../types';
import { googleADK } from './googleADK';

class AgentSystemService {
  private agents: Map<string, Agent> = new Map();
  private contentQueue: ContentItem[] = [];
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeAgents();
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

  private async startAgentOrchestration() {
    // Simulate autonomous agent behavior
    setInterval(() => {
      this.agents.forEach(agent => {
        if (Math.random() < 0.3) { // 30% chance to change status
          this.simulateAgentActivity(agent);
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
          title: `Content about ${trend.keyword}`,
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
          assignedAgents: [agent.id]
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
      item.status === 'optimization'
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
        await this.processPublishing(item);
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
      const prompt = `Create engaging ${item.type} content about ${item.metadata.keywords.join(', ')} targeting ${item.metadata.target_audience}`;
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

  private async processPublishing(item: ContentItem) {
    const publisherAgent = Array.from(this.agents.values()).find(
      a => a.type === 'publisher' && a.status === 'idle'
    );

    if (!publisherAgent) return;

    this.updateAgentStatus(publisherAgent.id, 'working', `Publishing: ${item.title}`);
    
    try {
      // Simulate publishing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      item.status = 'published';
      item.updated_at = new Date().toISOString();
      item.assignedAgents.push(publisherAgent.id);

      this.updateAgentStatus(publisherAgent.id, 'completed', 'Content published');
      publisherAgent.tasksCompleted++;
      
      this.emit('contentUpdated', item);
    } catch (error) {
      this.updateAgentStatus(publisherAgent.id, 'error', 'Publishing failed');
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

  private getRandomTask(agentType: string): string {
    const tasks = {
      researcher: ['Analyzing trending topics', 'Gathering market insights', 'Competitor analysis'],
      generator: ['Creating content draft', 'Writing engaging copy', 'Developing storyline'],
      optimizer: ['Optimizing for SEO', 'Improving readability', 'Enhancing keywords'],
      publisher: ['Publishing to platforms', 'Scheduling posts', 'Managing distribution'],
      analyzer: ['Analyzing performance', 'Generating reports', 'Tracking metrics'],
      coordinator: ['Orchestrating workflow', 'Managing agent tasks', 'System monitoring']
    };

    const taskList = tasks[agentType as keyof typeof tasks] || ['Processing task'];
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

  getContentQueue(): ContentItem[] {
    return this.contentQueue;
  }

  pauseAgent(agentId: string) {
    this.updateAgentStatus(agentId, 'paused', 'Paused by user');
  }

  resumeAgent(agentId: string) {
    this.updateAgentStatus(agentId, 'idle');
  }
}

export const agentSystem = new AgentSystemService();