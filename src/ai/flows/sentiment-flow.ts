
'use server';
/**
 * @fileOverview A sentiment analysis AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SentimentSchema = z.enum(['Bullish', 'Bearish', 'Neutral']);

export const analyzeSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentFlow',
    inputSchema: z.string(),
    outputSchema: SentimentSchema,
  },
  async (headline) => {
    const prompt = `Analyze the sentiment of the following financial news headline. Respond with only one word: "Bullish", "Bearish", or "Neutral".

Headline: "${headline}"`;

    const { text } = await ai.generate({
      prompt: prompt,
      model: 'anthropic/claude-3-5-sonnet',
      config: {
        temperature: 0,
      },
    });

    const sentiment = text.trim();
    if (sentiment === 'Bullish' || sentiment === 'Bearish' || sentiment === 'Neutral') {
      return sentiment;
    }
    return 'Neutral';
  }
);

export async function analyzeSentiment(headline: string): Promise<z.infer<typeof SentimentSchema>> {
    return analyzeSentimentFlow(headline);
}
