// src/app/history/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Search, Trash2 } from 'lucide-react';

// Assuming shadcn/ui components are available
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import ConversationLog (ensure path/export is correct)
import { ConversationLog } from '@/components/ConversationLog';

// --- 1. Import sonner ---
import { toast } from "sonner";

// Define the Conversation type
interface Conversation {
  id: string;
  timestamp: Date;
  prompt: string;
  response: string;
}

export default function HistoryPage() {
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved conversations from localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedConversations = localStorage.getItem('turbo-conversations');
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        if (Array.isArray(parsed)) {
          const loadedConversations = parsed
            .map((c: any) => ({
              id: c.id ?? `${Date.now()}-${Math.random()}`,
              timestamp: new Date(c.timestamp),
              prompt: c.prompt ?? '',
              response: c.response ?? '',
            }))
            .filter((c): c is Conversation => c.timestamp instanceof Date && !isNaN(c.timestamp.getTime()))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setAllConversations(loadedConversations);
        } else {
          console.error('Parsed conversations data is not an array:', parsed);
          localStorage.removeItem('turbo-conversations');
          setAllConversations([]);
        }
      } else {
        setAllConversations([]);
      }
    } catch (e) {
      console.error('Failed to parse conversations from localStorage', e);
      localStorage.removeItem('turbo-conversations');
      setAllConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize filtered conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return allConversations;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allConversations.filter(conv =>
      conv.prompt.toLowerCase().includes(lowerCaseQuery) ||
      conv.response.toLowerCase().includes(lowerCaseQuery)
    );
  }, [allConversations, searchQuery]);

  // Function to clear history with toast feedback
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all conversation history? This cannot be undone.')) {
      try {
        localStorage.removeItem('turbo-conversations');
        setAllConversations([]);
        setSearchQuery('');
        // --- 2. Call toast on success ---
        toast.success("Conversation history cleared successfully!");
        // Removed console.log(...)
      } catch (e) {
        console.error('Failed to clear history from localStorage', e);
        // --- 3. Call toast on error ---
        toast.error("Failed to clear history.", {
            description: e instanceof Error ? e.message : 'Please check storage permissions or try again.',
        });
      }
    }
  };

  // --- Render JSX ---
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          Conversation History
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Review your past interactions with Turbo AI.
        </p>
      </header>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-72 md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2"
            aria-label="Search conversations"
          />
        </div>
        {/* Clear Button */}
        <Button
          onClick={clearHistory}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50 hover:border-destructive/60 whitespace-nowrap"
          disabled={allConversations.length === 0 || isLoading}
          aria-label="Clear all conversation history"
        >
          <Trash2 className="h-4 w-4" />
          Clear All History
        </Button>
      </div>

      {/* Content Area: Loading, Empty, or Log */}
      {isLoading ? (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>Loading history...</p>
            </CardContent>
          </Card>
       ) : filteredConversations.length > 0 ? (
        <Card className="mt-6">
          <CardContent className="p-4 md:p-6">
            {/* Ensure ConversationLog implementation is correct */}
            <ConversationLog interactions={filteredConversations} />
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>
              {searchQuery
                ? 'No conversations found matching your search.'
                : 'Your conversation history is empty.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}