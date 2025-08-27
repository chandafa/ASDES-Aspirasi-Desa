'use server';

/**
 * @fileOverview A report summarization AI agent.
 *
 * - summarizeReport - A function that handles the report summarization process.
 * - SummarizeReportInput - The input type for the summarizeReport function.
 * - SummarizeReportOutput - The return type for the summarizeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportInputSchema = z.object({
  reportTitle: z.string().describe('The title of the report.'),
  reportDescription: z.string().describe('The detailed description of the report.'),
});
export type SummarizeReportInput = z.infer<typeof SummarizeReportInputSchema>;

const SummarizeReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the report.'),
  progress: z.string().describe('Indicates the progress of the summarization.'),
});
export type SummarizeReportOutput = z.infer<typeof SummarizeReportOutputSchema>;

export async function summarizeReport(input: SummarizeReportInput): Promise<SummarizeReportOutput> {
  return summarizeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReportPrompt',
  input: {schema: SummarizeReportInputSchema},
  output: {schema: SummarizeReportOutputSchema},
  prompt: `You are an expert summarizer, skilled at condensing detailed reports into short, informative summaries.

  Please provide a one-sentence summary of the following report:

  Title: {{{reportTitle}}}
  Description: {{{reportDescription}}}
  `,
});

const summarizeReportFlow = ai.defineFlow(
  {
    name: 'summarizeReportFlow',
    inputSchema: SummarizeReportInputSchema,
    outputSchema: SummarizeReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'Report summarization complete.',
    };
  }
);
