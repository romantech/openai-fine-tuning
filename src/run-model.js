import OpenAI from 'openai';
import { trainingPrompt as prompt } from './data/training-prompt.js';
import { checkEnv } from './misc/env-checker.js';

checkEnv();

const openaiAPI = new OpenAI({ apiKey: process.env.API_KEY });

const fineTunedModel = ''; // TODO: Replace with your fine-tuned model id
const content = ''; // TODO: Replace with your input
const transformPrompt = prompt; // TODO: Replace with your own prompt

const fetchCompletion = async () => {
  try {
    const response = await openaiAPI.chat.completions.create({
      model: fineTunedModel,
      messages: [
        { role: 'system', content: transformPrompt },
        { role: 'user', content },
      ],
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
};

await fetchCompletion();
