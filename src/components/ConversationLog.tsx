// src/components/ConversationLog.tsx
'use client'; // Add this if using hooks or event handlers

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Example imports

// Assuming Conversation interface is defined elsewhere or duplicated/imported
interface Conversation {
  id: string;
  timestamp: Date;
  prompt: string;
  response: string;
}

interface ConversationLogProps {
  interactions: Conversation[]; // Make sure the prop name and type match
}

export const ConversationLog: React.FC<ConversationLogProps> = ({ interactions }) => {

  if (!interactions || interactions.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversation Log</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No conversation history yet.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
       <CardHeader>
         <CardTitle>Conversation Log</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         {interactions.map((interaction) => (
           <div key={interaction.id} className="p-3 border rounded-md bg-background">
              <p className="text-xs text-muted-foreground mb-1">
                  {interaction.timestamp.toLocaleString()}
              </p>
              <p><strong>You:</strong> {interaction.prompt}</p>
              <p className="mt-1 text-muted-foreground"><strong>AI:</strong> {interaction.response}</p>
           </div>
         ))}
       </CardContent>
    </Card>
  );
};

// Note: Using named export here