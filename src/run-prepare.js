import { promises as fsp } from 'fs';
import OpenAI from 'openai';
import inputList from './data/training-input-list.json' assert { type: 'json' };
import { trainingPrompt as prompt } from './data/training-prompt.js';
import { checkEnv } from './misc/env-checker.js';
import { trainingExamplesPath } from './misc/file-paths.js';

checkEnv();

const openaiAPI = new OpenAI({ apiKey: process.env.API_KEY });

const openAIOptions = { model: 'gpt-4', temperature: 0.4 }; // TODO Change this to your own options
const trainingPrompt = prompt; // TODO Change this to your own prompt
const trainingInputList = inputList; // TODO Change this to your own user content

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
    const content = response.choices[0].message.content;
    console.log(content);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating example:', error);
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
  for (const trainingInput of trainingInputList) {
    const generatedExample = await generateTrainingExample(trainingInput);
    if (generatedExample) generatedExamples.push(generatedExample);
  }
  await saveExamplesToFile(generatedExamples);
};

generateAndSaveCompletions().catch(console.error);
