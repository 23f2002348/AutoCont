import React from 'react';
import { SystemMetrics as SystemMetricsData } from '../types';
import { Activity, Target, Users, Zap, TrendingUp, Award } from 'lucide-react';

interface SystemMetricsProps {
  metrics: SystemMetricsData;
}

const SystemMetrics: React.FC<SystemMetricsProps> = ({ metrics }) => {
  const metricCards = [
    {
      label: 'Content Created',
      value: metrics.total_content_created,
      icon: <Target className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      label: 'Avg Trend Score',
      value: `${metrics.average_trend_score}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      label: 'Active Agents',
      value: metrics.active_agents,
      icon: <Users className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      change: '100%'
    },
    {
      label: 'Pipeline Items',
      value: metrics.content_pipeline_count,
      icon: <Activity className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      change: '+24%'
    },
    {
      label: 'Daily Output',
      value: metrics.daily_output,
      icon: <Zap className="w-5 h-5" />,
      color: 'from-yellow-500 to-yellow-600',
      change: '+35%'
    },
    {
      label: 'Success Rate',
      value: `${metrics.success_rate}%`,
      icon: <Award className="w-5 h-5" />,
      color: 'from-emerald-500 to-emerald-600',
      change: '+5%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((metric, index) => (
        <div
          key={metric.label}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color} text-white`}>
              {metric.icon}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-green-400">{metric.change}</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm font-medium">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};

export default SystemMetrics;