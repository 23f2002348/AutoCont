import React, { useState } from 'react';
import { Bot, Settings, BarChart3, FileText, Zap } from 'lucide-react';
import AgentCard from './components/AgentCard';
import ContentPipeline from './components/ContentPipeline';
import SystemMetrics from './components/SystemMetrics';
import GoogleADKSetup from './components/GoogleADKSetup';
import { useAgentSystem } from './hooks/useAgentSystem';
import { googleADK } from './services/googleADK';
import { GoogleADKConfig } from './types';

function App() {
  const { agents, content, metrics, pauseAgent, resumeAgent } = useAgentSystem();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'content' | 'settings'>('dashboard');
  const [googleConfig, setGoogleConfig] = useState<GoogleADKConfig | null>(null);

  const handleSaveGoogleConfig = (config: GoogleADKConfig) => {
    setGoogleConfig(config);
    googleADK.initialize(config);
    // In production, you would encrypt and store this securely
    localStorage.setItem('googleADKConfig', JSON.stringify(config));
  };

  // Load saved config on component mount
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('googleADKConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setGoogleConfig(config);
        googleADK.initialize(config);
      } catch (error) {
        console.error('Failed to load Google ADK config:', error);
      }
    }
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'agents', label: 'Agents', icon: <Bot className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ContentAI</h1>
                <p className="text-sm text-gray-400">Multi-Agent Content Creation System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                {googleConfig ? 'Google ADK Connected' : 'Setup Required'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
              <SystemMetrics metrics={metrics} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Active Agents</h3>
                <div className="grid gap-4">
                  {agents.slice(0, 4).map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onPause={pauseAgent}
                      onResume={resumeAgent}
                    />
                  ))}
                </div>
              </div>
              
              <ContentPipeline content={content} />
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Agent Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onPause={pauseAgent}
                  onResume={resumeAgent}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Content Management</h2>
            <ContentPipeline content={content} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">System Configuration</h2>
            <GoogleADKSetup 
              onSave={handleSaveGoogleConfig} 
              currentConfig={googleConfig}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;