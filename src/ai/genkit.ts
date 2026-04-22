
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {anthropic} from '@genkit-ai/anthropic';

/**
 * Institutional Genkit Configuration.
 * 
 * Powered by Claude 3.5 Sonnet for structural synthesis 
 * and Gemini for multimodal audio/vision tracks.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }),
    anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  ],
  model: 'anthropic/claude-3-5-sonnet',
});
