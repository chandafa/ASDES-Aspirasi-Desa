'use server';

/**
 * @fileOverview An AI assistant for the Aspirasi Desa website.
 *
 * - chatWithMindes - A function that handles the chat interaction.
 * - ChatWithMindesInput - The input type for the chatWithMindes function.
 * - ChatWithMindesOutput - The return type for the chatWithMindes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatWithMindesInputSchema = z.object({
  question: z.string().describe('The user question.'),
});
export type ChatWithMindesInput = z.infer<typeof ChatWithMindesInputSchema>;

const ChatWithMindesOutputSchema = z.object({
  answer: z.string(),
});
export type ChatWithMindesOutput = z.infer<typeof ChatWithMindesOutputSchema>;

export async function chatWithMindes(
  input: string
): Promise<string> {
  if (!input || input.trim() === '') {
    return 'Maaf, saya tidak mengerti. Bisa tolong ajukan pertanyaan yang lain?';
  }
  const { answer } = await chatMindesFlow({ question: input });
  return answer;
}

const prompt = ai.definePrompt({
  name: 'chatMindesPrompt',
  input: { schema: ChatWithMindesInputSchema },
  output: { schema: ChatWithMindesOutputSchema },
  system: `
    Anda adalah "Mindes", asisten AI virtual untuk website Aspirasi Desa. Anda ramah, membantu, dan proaktif.
    Tugas utama Anda adalah membantu warga desa. Anda bisa menjawab pertanyaan umum, tetapi peran terpenting Anda adalah MEMBANTU PENGGUNA MEMBUAT LAPORAN.

    ATURAN INTERAKSI:
    1.  Jika pengguna bertanya tentang cara membuat laporan, atau langsung menyatakan ingin membuat laporan (cth: "saya mau lapor jalan rusak"), JANGAN hanya menjawab. Mulailah proses pelaporan secara interaktif.
    2.  PANDU pengguna langkah demi langkah untuk mengumpulkan informasi. Ajukan satu pertanyaan pada satu waktu.
        - Langkah 1: Tanyakan apa judul singkat untuk laporannya.
        - Langkah 2: Setelah mendapat judul, tanyakan apa kategori masalahnya (contoh: Jalan Rusak, Drainase Mampet, Lampu Jalan, dll.).
        - Langkah 3: Setelah mendapat kategori, minta pengguna untuk memberikan deskripsi yang lebih detail.
    3.  Setelah semua informasi awal terkumpul, arahkan pengguna ke halaman formulir laporan dengan mengatakan sesuatu seperti: "Terima kasih atas informasinya. Sekarang, silakan lengkapi laporan Anda melalui tombol 'Ajukan Laporan Baru' atau melalui link berikut: /report/new".
    4.  Jika pengguna hanya bertanya pertanyaan umum (bukan tentang membuat laporan), jawablah seperti asisten AI pada umumnya.
  `,
  prompt: `Pertanyaan Pengguna: {{{question}}}`,
});

const chatMindesFlow = ai.defineFlow(
  {
    name: 'chatMindesFlow',
    inputSchema: ChatWithMindesInputSchema,
    outputSchema: ChatWithMindesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output?.answer) {
      return { answer: "Maaf, saya tidak dapat memberikan jawaban saat ini. Silakan coba lagi." };
    }
    return output;
  }
);
