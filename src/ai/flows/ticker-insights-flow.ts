
'use server';
/**
 * @fileOverview An AI agent that generates research insights and tactical recommendations for a specific ticker.
 * 
 * Focus: High-Yield Silo Resilience, Inventory Velocity, and Concentration Risk.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TickerInsightsInputSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  sector: z.string(),
  price: z.number(),
  priceChange: z.number(),
  marketCap: z.number(),
  grossMargin: z.number().optional(),
  roe: z.number().optional(),
  debtToEquity: z.number().optional(),
  cashReserves: z.number().optional(),
  inventory: z.number().optional(),
  receivables: z.number().optional(),
  totalDebt: z.number().optional(),
  moatStatus: z.string().optional(),
  news: z.array(z.any()),
});

export const tickerInsightsFlow = ai.defineFlow(
  {
    name: 'tickerInsightsFlow',
    inputSchema: TickerInsightsInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const prompt = `You are a senior quantitative logistics analyst at a premier institutional fund. Provide a high-impact research insight for ${input.name} (${input.symbol}).

Primary Goal: Analyze the "High-Yield Silo" resilience using recursive synthesis of supply chain and balance sheet health.

Current Institutional Data:
- Price: $${input.price} (${input.priceChange}%)
- Cash (Soil): $${input.cashReserves ? (input.cashReserves / 1e9).toFixed(2) + 'B' : 'N/A'}
- Inventory (Silo): $${input.inventory ? (input.inventory / 1e9).toFixed(2) + 'B' : 'N/A'}
- Receivables (Yield): $${input.receivables ? (input.receivables / 1e9).toFixed(2) + 'B' : 'N/A'}
- Efficiency: Gross Margin: ${input.grossMargin ? (input.grossMargin * 100).toFixed(1) + '%' : 'N/A'}
- Risk Profile: Debt/Equity: ${input.debtToEquity || 'N/A'} | Total Debt: $${input.totalDebt ? (input.totalDebt / 1e9).toFixed(2) + 'B' : 'N/A'} | Moat: ${input.moatStatus || 'None'}
- News Context: ${input.news.slice(0, 3).map(n => n.title).join(' | ')}

Analytical Requirements (Recursive Synthesis):
1. **Inventory Velocity**: How fast are they turning the "silo" of parts into finished products and yield?
2. **Concentration Risk**: Flag if the company relies on a single supplier for more than 30% of their critical components based on sector standards.
3. **Farming Metaphor**: Is the company's "soil" (cash flow) rich enough to survive a "drought" (supply chain disruption)?

Format your response exactly as follows:
**SILO STATUS:** [Optimal / Warning / Critical]
**RECURSIVE THESIS:** [Analyze if the "soil" is rich enough to survive a drought. Assess Inventory Velocity.]
**LOGISTICS ALPHA:** [Assess the supply chain position. Flag concentration risk and structural moats.]
**STABILITY SCORE:** [X/10 based on fundamental silo resilience vs current macro disruption potential]`;

    try {
      const { text } = await ai.generate({
        prompt: prompt,
        model: 'anthropic/claude-3-5-sonnet',
        config: {
          temperature: 0.3,
        },
      });

      return text;
    } catch (error: any) {
      console.error("Genkit AI generate error:", error);
      return "SYSTEM_ERROR: Unable to synthesize silo resilience. Reverting to local metrics.";
    }
  }
);

export async function getTickerInsights(input: z.infer<typeof TickerInsightsInputSchema>): Promise<string> {
    return tickerInsightsFlow(input);
}
