import { useState, useEffect } from 'react';
import { Agent, ContentItem, SystemMetrics, VideoAgent } from '../types';
import { agentSystem } from '../services/agentSystem';

export const useAgentSystem = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [videoAgents, setVideoAgents] = useState<VideoAgent[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    total_content_created: 0,
    average_trend_score: 0,
    active_agents: 0,
    content_pipeline_count: 0,
    daily_output: 0,
    success_rate: 0,
    videos_created: 0,
    reels_created: 0
  });

  useEffect(() => {
    // Initialize data
    setAgents(agentSystem.getAgents());
    setVideoAgents(agentSystem.getVideoAgents());
    setContent(agentSystem.getContentQueue());

    // Set up event listeners for real-time updates
    agentSystem.on('agentUpdated', (updatedAgent: Agent) => {
      setAgents(prev => prev.map(agent => 
        agent.id === updatedAgent.id ? updatedAgent : agent
      ));
    });

    agentSystem.on('videoAgentUpdated', (updatedAgent: VideoAgent) => {
      setVideoAgents(prev => prev.map(agent => 
        agent.id === updatedAgent.id ? updatedAgent : agent
      ));
    });

    agentSystem.on('contentAdded', (newContent: ContentItem[]) => {
      setContent(prev => [...prev, ...newContent]);
    });

    agentSystem.on('contentUpdated', (updatedContent: ContentItem) => {
      setContent(prev => prev.map(item => 
        item.id === updatedContent.id ? updatedContent : item
      ));
    });

    // Update metrics periodically
    const metricsInterval = setInterval(() => {
      const currentAgents = agentSystem.getAgents();
      const currentVideoAgents = agentSystem.getVideoAgents();
      const currentContent = agentSystem.getContentQueue();
      
      setMetrics({
        total_content_created: currentContent.length,
        average_trend_score: currentContent.length > 0 
          ? Math.round(currentContent.reduce((sum, item) => sum + item.trend_score, 0) / currentContent.length)
          : 0,
        active_agents: [...currentAgents, ...currentVideoAgents].filter(agent => agent.status === 'working').length,
        content_pipeline_count: currentContent.filter(item => 
          ['research', 'generation', 'optimization'].includes(item.status)
        ).length,
        daily_output: currentContent.filter(item => 
          new Date(item.created_at).toDateString() === new Date().toDateString()
        ).length,
        success_rate: currentContent.length > 0
          ? Math.round((currentContent.filter(item => item.status === 'published').length / currentContent.length) * 100)
          : 0,
        videos_created: currentContent.filter(item => item.videoContent?.status === 'completed').length,
        reels_created: currentContent.filter(item => 
          item.videoContent?.status === 'completed' && item.videoContent?.type === 'reel'
        ).length
      });
    }, 5000);

    return () => {
      clearInterval(metricsInterval);
    };
  }, []);

  const pauseAgent = (agentId: string) => {
    agentSystem.pauseAgent(agentId);
  };

  const resumeAgent = (agentId: string) => {
    agentSystem.resumeAgent(agentId);
  };

  const updateContent = (contentId: string, updates: Partial<ContentItem>) => {
    agentSystem.updateContent(contentId, updates);
  };

  const requestRevision = (contentId: string, feedback: string) => {
    agentSystem.requestRevision(contentId, feedback);
  };

  return {
    agents,
    videoAgents,
    content,
    metrics,
    pauseAgent,
    resumeAgent,
    updateContent,
    requestRevision
  };
};