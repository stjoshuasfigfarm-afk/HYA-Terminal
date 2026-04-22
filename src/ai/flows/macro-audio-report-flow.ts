
'use server';
/**
 * @fileOverview A flow that generates an audio report of the macro corridor data using Gemini TTS.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const MacroReportInputSchema = z.object({
  t10: z.number(),
  t2: z.number(),
  fedFunds: z.string(),
  sectors: z.array(z.object({
    name: z.string(),
    change: z.number()
  }))
});

export type MacroReportInput = z.infer<typeof MacroReportInputSchema>;

export async function generateMacroAudioReport(input: MacroReportInput) {
  return macroAudioReportFlow(input);
}

const macroAudioReportFlow = ai.defineFlow(
  {
    name: 'macroAudioReportFlow',
    inputSchema: MacroReportInputSchema,
    outputSchema: z.object({
      audioDataUri: z.string()
    }),
  },
  async (input) => {
    const topSector = input.sectors.sort((a, b) => b.change - a.change)[0];
    const script = `Institutional Macro Briefing. 
    The US 10-Year Treasury Yield is currently at ${input.t10.toFixed(2)} percent. 
    The 2-Year Yield is at ${input.t2.toFixed(2)} percent. 
    Federal Funds Rate stands at ${input.fedFunds} percent. 
    Sector momentum is strongest in ${topSector.name}, which is up ${topSector.change} percent today.
    End of briefing.`;

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: script,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate audio media.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);
    
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
