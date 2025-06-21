import React from 'react';
import { ContentItem } from '../types';
import { FileText, TrendingUp, Search, Zap, Share2, BarChart3 } from 'lucide-react';

interface ContentPipelineProps {
  content: ContentItem[];
}

const ContentPipeline: React.FC<ContentPipelineProps> = ({ content }) => {
  const getStatusStep = (status: string) => {
    const steps = ['research', 'generation', 'optimization', 'review', 'approved', 'published'];
    return steps.indexOf(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'research': return <Search className="w-4 h-4" />;
      case 'generation': return <FileText className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'review': return <BarChart3 className="w-4 h-4" />;
      case 'approved': return <TrendingUp className="w-4 h-4" />;
      case 'published': return <Share2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'research': return 'text-blue-400 bg-blue-500/20';
      case 'generation': return 'text-purple-400 bg-purple-500/20';
      case 'optimization': return 'text-yellow-400 bg-yellow-500/20';
      case 'review': return 'text-orange-400 bg-orange-500/20';
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'published': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Content Pipeline</h3>
      
      <div className="space-y-4">
        {content.slice(0, 8).map((item) => (
          <div key={item.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                </div>
                <div>
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">{item.trend_score}%</div>
                  <div className="text-gray-500">Trend</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{item.seo_score}</div>
                  <div className="text-gray-500">SEO</div>
                </div>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center space-x-2 mb-3">
              {['research', 'generation', 'optimization', 'review', 'approved', 'published'].map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`w-3 h-3 rounded-full ${
                    getStatusStep(item.status) >= index 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gray-600'
                  }`} />
                  {index < 5 && (
                    <div className={`w-4 h-0.5 ${
                      getStatusStep(item.status) > index 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gray-600'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Updated {new Date(item.updated_at).toLocaleTimeString()}</span>
              <span>{item.assignedAgents.length} agents</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPipeline;