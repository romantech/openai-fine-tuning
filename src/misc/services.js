import OpenAI from 'openai';

export const openaiAPI = new OpenAI({ apiKey: process.env.API_KEY });
