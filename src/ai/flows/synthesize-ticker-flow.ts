
'use server';
/**
 * @fileOverview An AI agent that generates deep-dive structural intelligence for a ticker.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SynthesizeTickerInputSchema = z.object({
  symbol: z.string(),
  name: z.string().optional(),
});

const SupplyChainNodeSchema = z.object({
  name: z.string().describe('Ticker symbol or company name'),
  type: z.string().describe('Component/Service provided'),
  contractValue: z.string().describe('Strategic importance level'),
  summary: z.string().describe('1-sentence role in supply chain'),
  status: z.enum(['Active', 'Bottlenecked', 'Delayed']).describe('Current logistics status'),
  throughput: z.number().describe('Estimated annual throughput value in USD'),
  geopoint: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  transitLinks: z.array(z.object({
    target: z.string(),
    distanceKm: z.number(),
    leadTimeDays: z.number()
  })).optional()
});

const StructuralIntelligenceSchema = z.object({
  description: z.string().describe('Detailed institutional profile'),
  sector: z.string(),
  moatStatus: z.enum(['Wide', 'Narrow', 'None']),
  moatDescription: z.string(),
  revenueSegments: z.array(z.object({
    label: z.string(),
    value: z.number().describe('Estimated annual revenue in USD'),
  })),
  suppliers: z.array(SupplyChainNodeSchema),
  midstream: z.array(SupplyChainNodeSchema),
  customers: z.array(SupplyChainNodeSchema),
});

export const synthesizeTickerFlow = ai.defineFlow(
  {
    name: 'synthesizeTickerFlow',
    inputSchema: SynthesizeTickerInputSchema,
    outputSchema: StructuralIntelligenceSchema,
  },
  async (input) => {
    const prompt = `You are a senior institutional equity analyst specializing in logistics and supply chain topology. Generate a deep-dive structural intelligence mapping for ${input.symbol} ${input.name ? `(${input.name})` : ''}.

Focus on:
1. **Detailed Hardware/Service Dependencies**: Identify critical Tier-1 suppliers.
2. **Logistics Fidelity**: Assign realistic Geospatial Coordinates (lat/lng), Throughput Volumes, and Lead Times.
3. **Recursive Synthesis**: Assess the "High-Yield Silo" resilience.
4. **Moat Status**: Define the structural alpha.

Return a highly professional, data-rich profile in JSON format matching the schema.`;

    const { output } = await ai.generate({
      prompt: prompt,
      model: 'anthropic/claude-3-5-sonnet',
      output: { schema: StructuralIntelligenceSchema },
      config: {
        temperature: 0.4,
      },
    });

    return output!;
  }
);

export async function synthesizeTickerData(symbol: string, name?: string) {
    return synthesizeTickerFlow({ symbol, name });
}
