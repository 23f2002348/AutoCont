import React from 'react';
import { VideoAgent } from '../types';
import { Video, Film, Clock, CheckCircle, AlertCircle, Pause, Play, Download } from 'lucide-react';

interface VideoAgentCardProps {
  agent: VideoAgent;
  onPause: (agentId: string) => void;
  onResume: (agentId: string) => void;
}

const VideoAgentCard: React.FC<VideoAgentCardProps> = ({ agent, onPause, onResume }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return agent.type === 'video_creator' ? <Video className="w-4 h-4" /> : <Film className="w-4 h-4" />;
    }
  };

  const getAgentIcon = () => {
    return agent.type === 'video_creator' ? <Video className="w-5 h-5 text-purple-400" /> : <Film className="w-5 h-5 text-pink-400" />;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${agent.type === 'video_creator' ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20'}`}>
            {getAgentIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-white">{agent.name}</h3>
            <p className="text-sm text-gray-400 capitalize">{agent.type.replace('_', ' ')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
            <span className="capitalize">{agent.status}</span>
          </div>
          {agent.status === 'paused' ? (
            <button
              onClick={() => onResume(agent.id)}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4 text-gray-400 hover:text-green-400" />
            </button>
          ) : (
            <button
              onClick={() => onPause(agent.id)}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
            </button>
          )}
        </div>
      </div>

      {agent.currentTask && (
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">{agent.currentTask}</p>
          {agent.status === 'working' && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  agent.type === 'video_creator' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500'
                }`}
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Video-specific metrics */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Videos Created</span>
          <span className="text-purple-400 font-medium">{agent.videosCreated}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Avg Duration</span>
          <span className="text-blue-400 font-medium">{agent.averageDuration}s</span>
        </div>
        {agent.currentVideoFormat && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Format</span>
            <span className="text-green-400 font-medium">{agent.currentVideoFormat}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        <span>Tasks: {agent.tasksCompleted}</span>
        <span>Last: {new Date(agent.lastActivity).toLocaleTimeString()}</span>
      </div>

      {/* Download button for completed videos */}
      {agent.status === 'completed' && agent.currentTask && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 rounded-lg hover:from-purple-500/30 hover:to-blue-500/30 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download Video</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoAgentCard;