import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  console.error('❌  GOOGLE_API_KEY is not set in your server/.env file.');
  console.error('    Get a free key at https://aistudio.google.com/apikey');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const getGenerativeModel = (modelName = 'gemini-2.0-flash') => {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 4096,
    },
  });
};

export default genAI;