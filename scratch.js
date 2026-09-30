import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
(async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Cari Google Maps untuk Mobeng Cipondoh Tangerang. Berapa rating bintang rata-ratanya dan berapa total jumlah ulasannya? Berikan jawaban dalam JSON { rating: number, reviewCount: number } saja.',
    config: {
      tools: [{ googleSearch: {} }],
    }
  });
  console.log(response.text);
})();
