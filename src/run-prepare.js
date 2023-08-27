import { promises as fsp } from 'fs';
import OpenAI from 'openai';
import trainingSentences from './data/training-sentences.json' assert { type: 'json' };
import { trainingPrompt as prompt } from './data/training-prompt.js';
import { checkEnv } from './misc/env-checker.js';
import { trainingExamplesPath } from './misc/file-paths.js';

checkEnv();

const openaiAPI = new OpenAI({ apiKey: process.env.API_KEY });

const openAIOptions = { model: 'gpt-4', temperature: 0.4 }; // TODO Change this to your own options
const trainingPrompt = prompt; // TODO Change this to your own prompt

const generatedExamples = [];

const generateTrainingExample = async input => {
  try {
    const response = await openaiAPI.chat.completions.create({
      messages: [
        { role: 'system', content: trainingPrompt },
        { role: 'user', content: JSON.stringify(input) },
      ],
      ...openAIOptions,
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating example:', error);
    throw error;
  }
};

const saveExamplesToFile = async exampleArray => {
  try {
    await fsp.writeFile(trainingExamplesPath, JSON.stringify(exampleArray));
    console.log('File has been updated');
  } catch (error) {
    console.error('An error occurred while saving the file:', error);
    throw error;
  }
};

const generateAndSaveCompletions = async () => {
  for (const trainingSentence of trainingSentences) {
    const generatedExample = await generateTrainingExample(trainingSentence);
    if (generatedExample) generatedExamples.push(generatedExample);
  }
  await saveExamplesToFile(generatedExamples);
};

generateAndSaveCompletions().catch(console.error);