// src/lib/actions.ts
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateWithGemini(prompt: string) {
  try {
    if (!prompt.trim()) {
      throw new Error('Prompt is required');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 1000  // Limit response length
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
    
  } catch (error) {
    console.error('Generation failed:', error);
    throw new Error('Failed to generate content');
  }
}