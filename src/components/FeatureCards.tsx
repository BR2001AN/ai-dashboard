// src/components/FeatureCards.tsx
'use client';

import { Zap, Database, Cpu, Sparkles } from 'lucide-react';

interface FeatureCardsProps {
  conversations: Array<{
    id: string;
    timestamp: Date;
    prompt: string;
    response: string;
  }>;
}

export const FeatureCards = ({ conversations }: FeatureCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Quick Actions Card */}
      <div className="bg-card-bg border border-border/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-primary-accent/30">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Quick Actions
        </h3>
        <p className="text-foreground/70 mt-2 text-sm mb-3">
          Common tasks and shortcuts
        </p>
        <div className="space-y-2">
          <button className="w-full text-left p-2 text-sm rounded-md hover:bg-background/50 transition-colors flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            New Conversation
          </button>
          <button className="w-full text-left p-2 text-sm rounded-md hover:bg-background/50 transition-colors flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-500" />
            Export Data
          </button>
          <button className="w-full text-left p-2 text-sm rounded-md hover:bg-background/50 transition-colors flex items-center gap-2">
            <Cpu className="h-4 w-4 text-green-500" />
            Model Settings
          </button>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-card-bg border border-border/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-primary-accent/30">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Recent Activity
        </h3>
        <p className="text-foreground/70 mt-2 text-sm mb-3">
          Your latest interactions
        </p>
        <div className="space-y-3">
          {conversations.slice(0, 3).map((conv) => (
            <div key={conv.id} className="text-sm">
              <div className="flex justify-between">
                <span className="font-medium truncate max-w-[180px]">{conv.prompt.substring(0, 30)}...</span>
                <span className="text-foreground/50 text-xs">
                  {conv.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-foreground/70 truncate">{conv.response.substring(0, 40)}...</div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="text-sm text-foreground/70 italic">No recent activity</div>
          )}
        </div>
      </div>

      {/* Performance Metrics Card */}
      <div className="bg-card-bg border border-border/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-primary-accent/30">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Performance
        </h3>
        <p className="text-foreground/70 mt-2 text-sm mb-3">
          System health and metrics
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>API Latency</span>
              <span className="font-medium">142ms</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Token Usage</span>
              <span className="font-medium">58%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '58%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Success Rate</span>
              <span className="font-medium">98.2%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};