// hooks/useGemini.ts
'use client';

import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface FileData {
  base64: string;
  mimeType: string;
}

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = useCallback(async (messages: Message[], files?: FileData[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, files }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const reader = response.body?.getReader();
      return {
        async *[Symbol.asyncIterator]() {
          if (!reader) return;
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            yield decoder.decode(value);
          }
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { chat, loading, error };
};