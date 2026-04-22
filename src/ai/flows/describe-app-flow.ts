
'use server';
/**
 * @fileOverview An AI agent that can describe the Analysis Terminal application.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const describeAppFlow = ai.defineFlow(
  {
    name: 'describeAppFlow',
    inputSchema: z.void(),
    outputSchema: z.string(),
  },
  async () => {
    const prompt = `You are an expert technical writer. Generate a concise and engaging description of the "Analysis Terminal" application.

The application is a sophisticated financial analysis tool with a focus on "Quantitative Logistics Intelligence".

Key Features:
- **Live Supply Chain Topology:** Visualizes the relationships between a central company and its suppliers, midstream partners, and customers.
- **Real-Time Data Integration:** High-yield cache rehydration from institutional silos.
- **AI-Enhanced News Feed:** Displays recent news articles with AI-powered sentiment analysis.
- **Financial Metrics Panel:** Shows key indicators like market cap, P/E ratio, and structural margins.
- **Entity Synthesis:** Users can create new, synthetic company tickers to add to the session.

Based on these features, generate a compelling summary of what the Analysis Terminal is and what it does.`;

    const { text } = await ai.generate({
      prompt: prompt,
      model: 'anthropic/claude-3-5-sonnet',
      config: {
        temperature: 0.5,
      },
    });

    return text;
  }
);

export async function describeApp(): Promise<string> {
    return describeAppFlow();
}
