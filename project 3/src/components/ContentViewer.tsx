import React, { useState } from 'react';
import { ContentItem } from '../types';
import { Eye, Edit3, ThumbsUp, ThumbsDown, MessageSquare, Video, Film, Download, Share2 } from 'lucide-react';

interface ContentViewerProps {
  content: ContentItem[];
  onUpdateContent: (contentId: string, updates: Partial<ContentItem>) => void;
  onRequestRevision: (contentId: string, feedback: string) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, onUpdateContent, onRequestRevision }) => {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

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

  const handleApprove = (contentId: string) => {
    onUpdateContent(contentId, { status: 'approved' });
  };

  const handleRequestRevision = (contentId: string) => {
    if (feedback.trim()) {
      onRequestRevision(contentId, feedback);
      setFeedback('');
      setShowFeedbackForm(false);
    }
  };

  const generateVideoContent = (contentId: string) => {
    onUpdateContent(contentId, {
      metadata: {
        ...content.find(c => c.id === contentId)?.metadata!,
        video_requested: true,
        video_status: 'pending'
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {content.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedContent(item)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  <span className="capitalize">{item.status}</span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Trend Score</span>
                <span className="text-blue-400 font-medium">{item.trend_score}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">SEO Score</span>
                <span className="text-green-400 font-medium">{item.seo_score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Engagement</span>
                <span className="text-purple-400 font-medium">{item.engagement_prediction}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.type}</span>
              <span>{new Date(item.updated_at).toLocaleDateString()}</span>
            </div>

            {item.content && (
              <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-sm text-gray-300 line-clamp-3">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedContent.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContent.status)}`}>
                      {selectedContent.status}
                    </div>
                    <span className="text-gray-400 text-sm">{selectedContent.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Content</h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedContent.content || 'Content is being generated...'}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Metadata</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Keywords:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedContent.metadata.keywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Target Audience:</span>
                    <p className="text-white capitalize">{selectedContent.metadata.target_audience}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Platforms:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedContent.metadata.platform.map((platform, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Estimated Reach:</span>
                    <p className="text-white">{selectedContent.metadata.estimated_reach.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                    <div className="text-blue-400 font-bold text-lg">{selectedContent.trend_score}%</div>
                    <div className="text-gray-400 text-sm">Trend Score</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-bold text-lg">{selectedContent.seo_score}</div>
                    <div className="text-gray-400 text-sm">SEO Score</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                    <div className="text-purple-400 font-bold text-lg">{selectedContent.engagement_prediction}%</div>
                    <div className="text-gray-400 text-sm">Engagement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-700 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedContent.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Request Revision</span>
                  </button>
                  <button
                    onClick={() => generateVideoContent(selectedContent.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Create Video</span>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Feedback Form */}
              {showFeedbackForm && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide specific feedback for revision..."
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => setShowFeedbackForm(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRequestRevision(selectedContent.id)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;