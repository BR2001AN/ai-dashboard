// src/app/dashboard/page.tsx
'use client';

// Import React and necessary hooks
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Activity,
  Database,
  Zap,
  MessageSquare,
  Cpu,
  Clock,
  Sparkles
} from 'lucide-react';

// --- Component Imports ---
// Assuming UsageCard exists if needed elsewhere, but not used here
// import { UsageCard } from '@/components/UsageCard';

// FeatureCards import REMOVED as the component is removed from rendering
// import { FeatureCards } from '@/components/FeatureCards';

// **** IMPORTANT: Ensure ConversationLog is correctly imported ****
// Verify the path and that ConversationLog is a named export from its file.
// Also ensure ConversationLog.tsx has 'use client'; if it uses hooks.
import { ConversationLog } from '@/components/ConversationLog';


// --- Interfaces ---
interface Conversation {
  id: string;
  timestamp: Date;
  prompt: string;
  response: string;
}

// --- Child Component: TurboAIComponent ---
// (Defined outside Dashboard for better organization)
const TurboAIComponent = ({ onNewConversation }: { onNewConversation: (prompt: string, response: string) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/gemini', { // Assuming this API route exists
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        let errorMsg = `Failed to fetch response. Status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (parseError) { /* Ignore */ }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      const responseText = data.text ?? 'Received empty response.';
      setResponse(responseText);
      onNewConversation(prompt, responseText);
      setPrompt(''); // Clear prompt on success

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("API call failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Turbo AI Playground
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Enter your prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 min-h-[120px] rounded-lg"
            placeholder="Ask Turbo anything..."
            disabled={isLoading}
            rows={5}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? 'Processing...' : 'Generate Response'}
          </Button>
        </div>
      </form>
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/30">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      {response && !isLoading && (
        <div className="mt-6 space-y-2">
          <h3 className="font-medium">AI Response:</h3>
          <Card className="p-4 bg-muted/50">
            <p className="whitespace-pre-wrap prose dark:prose-invert max-w-none">{response}</p>
          </Card>
        </div>
      )}
    </div>
  );
};


// --- Main Dashboard Component ---
const Dashboard = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('turbo-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        if (Array.isArray(parsed)) {
          setConversations(parsed.map((c: any) => ({
            id: c.id ?? Date.now().toString() + Math.random(), // More robust fallback id
            timestamp: new Date(c.timestamp),
            prompt: c.prompt ?? '',
            response: c.response ?? '',
          })).filter(c => !isNaN(c.timestamp.getTime())));
        } else {
          console.error('Saved conversations data is not an array:', parsed);
          localStorage.removeItem('turbo-conversations');
        }
      } catch (e) {
        console.error('Failed to parse conversations from localStorage', e);
        localStorage.removeItem('turbo-conversations');
      }
    }
  }, []);

  // Add new conversation to state and localStorage
  const handleNewConversation = useCallback((prompt: string, response: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      timestamp: new Date(),
      prompt,
      response
    };
    setConversations(prevConversations => {
      const updated = [newConversation, ...prevConversations].slice(0, 50); // Keep latest 50
      try {
        localStorage.setItem('turbo-conversations', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save conversations to localStorage', e);
      }
      return updated;
    });
  }, []); // useCallback ensures stable function reference

  // Calculate stats based on conversations state
  const queriesToday = conversations.filter(c => {
    const today = new Date();
    return c.timestamp.getDate() === today.getDate() &&
           c.timestamp.getMonth() === today.getMonth() &&
           c.timestamp.getFullYear() === today.getFullYear();
  }).length;

  const tokensProcessed = conversations.reduce((sum, c) => {
    // Basic estimation: ~1 token per 4 chars for English
    const promptTokens = Math.ceil((c.prompt?.length ?? 0) / 4);
    const responseTokens = Math.ceil((c.response?.length ?? 0) / 4);
    return sum + promptTokens + responseTokens;
  }, 0);

  // --- Card Click Handlers & Styling ---
  const handleCardClick = (cardTitle: string) => {
    console.log(`Card clicked: ${cardTitle}`);
    // TODO: Implement actual action (navigation, modal, etc.)
    // Example: alert(`Navigating to details for ${cardTitle}...`);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, cardTitle: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(cardTitle);
    }
  };

  const interactiveCardClass = "transition-all duration-200 hover:shadow-md hover:bg-muted/50 dark:hover:bg-muted/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"; // Ensure rounded-lg for focus ring

  return (
    <div className="space-y-6 p-4 md:p-6 min-h-screen bg-background text-foreground">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome to Turbo</h1>
        <p className="text-muted-foreground mt-1 md:mt-2">
          Your assistant for all things AI. Explore the dashboard or try out the Turbo AI.
        </p>
      </header>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="turbo-ai">Turbo AI</TabsTrigger>
        </TabsList>

        {/* === Dashboard Tab === */}
        <TabsContent value="dashboard" className="mt-4 space-y-6">
          {/* Stats Grid - Interactive Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Total Queries', icon: MessageSquare, value: conversations.length, desc: `${queriesToday} today`, aria: 'View details for Total Queries' },
              { title: 'Tokens Processed (Est.)', icon: Database, value: tokensProcessed.toLocaleString(), desc: '42k tokens remaining', aria: 'View details for Tokens Processed' },
              { title: 'API Calls Today', icon: Activity, value: queriesToday, desc: 'Peak: Now', aria: 'View details for API Calls Today' },
              { title: 'Model Accuracy', icon: Cpu, value: '94.7%', desc: '+2.1% improvement', aria: 'View details for Model Accuracy' },
              { title: 'Avg. Response Time', icon: Clock, value: '1.2s', desc: '-0.3s from last month', aria: 'View details for Average Response Time' },
              { title: 'Active Sessions', icon: Zap, value: '18', desc: '3 new today', aria: 'View details for Active Sessions' },
            ].map((card) => (
              <Card
                key={card.title}
                className={interactiveCardClass}
                onClick={() => handleCardClick(card.title)}
                onKeyDown={(e) => handleCardKeyDown(e, card.title)}
                role="button"
                tabIndex={0}
                aria-label={card.aria}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <card.icon className="h-4 w-4" />
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{card.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FeatureCards component REMOVED */}

        </TabsContent>

        {/* === Turbo AI Tab === */}
        <TabsContent value="turbo-ai" className="mt-4 space-y-6">
          {/* AI Interaction Component */}
          <Card className="p-4 md:p-6">
            <TurboAIComponent onNewConversation={handleNewConversation} />
          </Card>

          {/* Conversation Log */}
          {conversations.length > 0 && (
            <Card className="p-4 md:p-6">
              {/* Ensure ConversationLog is correctly imported and functional */}
              <ConversationLog interactions={conversations} />
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;