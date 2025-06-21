import React, { useState } from 'react';
import { GoogleADKConfig } from '../types';
import { Settings, Key, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface GoogleADKSetupProps {
  onSave: (config: GoogleADKConfig) => void;
  currentConfig?: GoogleADKConfig | null;
}

const GoogleADKSetup: React.FC<GoogleADKSetupProps> = ({ onSave, currentConfig }) => {
  const [config, setConfig] = useState<GoogleADKConfig>(currentConfig || {
    api_key: '',
    project_id: '',
    service_account_key: '',
    enabled_services: ['trends', 'gemini', 'analytics', 'search-console']
  });

  const [showKeys, setShowKeys] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  const services = [
    { id: 'trends', name: 'Google Trends API', description: 'For trending topic analysis' },
    { id: 'gemini', name: 'Gemini AI API', description: 'For content generation' },
    { id: 'analytics', name: 'Google Analytics API', description: 'For performance tracking' },
    { id: 'search-console', name: 'Search Console API', description: 'For SEO insights' }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Google ADK Configuration</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Key className="w-4 h-4 inline mr-2" />
            Google API Key
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={config.api_key}
            onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
            placeholder="Enter your Google API key..."
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a>
          </p>
        </div>

        {/* Project ID */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Database className="w-4 h-4 inline mr-2" />
            Google Cloud Project ID
          </label>
          <input
            type="text"
            value={config.project_id}
            onChange={(e) => setConfig({ ...config, project_id: e.target.value })}
            placeholder="your-project-id"
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Service Account Key */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Service Account Key (JSON)
          </label>
          <textarea
            value={config.service_account_key}
            onChange={(e) => setConfig({ ...config, service_account_key: e.target.value })}
            placeholder="Paste your service account key JSON here..."
            rows={4}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Download from <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Service Accounts page</a>
          </p>
        </div>

        {/* Enabled Services */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Enabled Services
          </label>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center space-x-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700/30">
                <input
                  type="checkbox"
                  id={service.id}
                  checked={config.enabled_services.includes(service.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfig({
                        ...config,
                        enabled_services: [...config.enabled_services, service.id]
                      });
                    } else {
                      setConfig({
                        ...config,
                        enabled_services: config.enabled_services.filter(s => s !== service.id)
                      });
                    }
                  }}
                  className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor={service.id} className="text-white font-medium cursor-pointer">
                    {service.name}
                  </label>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </div>
                {config.enabled_services.includes(service.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setShowKeys(!showKeys)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showKeys ? 'Hide' : 'Show'} sensitive data
          </button>
          
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoogleADKSetup;