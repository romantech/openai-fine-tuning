import { promises as fsp } from 'fs';
import { trainingInputList, trainingPrompt } from './data/index.js';
import {
  checkEnv,
  checkRequiredFiles,
  openaiAPI,
  PATHS,
} from './misc/index.js';

checkEnv();
await checkRequiredFiles(['trainingPrompt', 'trainingInputList']);

const openAIOptions = { model: 'gpt-4', temperature: 0.4 }; // TODO Change this to your own options
const generatedExamples = [];

const generateTrainingExample = async input => {
  try {
    console.log('Starting generation for input:', input);
    const system = { role: 'system', content: trainingPrompt };
    const user = { role: 'user', content: JSON.stringify(input) };

    const response = await openaiAPI.chat.completions.create({
      messages: [system, user],
      ...openAIOptions,
    });

    const content = JSON.parse(response.choices[0].message.content);
    console.dir(content, { depth: null });

    return content;
  } catch (error) {
    console.error('Error generating example:', error);
  }
};

const saveExamplesToFile = async exampleArray => {
  try {
    await fsp.writeFile(PATHS.TRAINING_EXAMPLES, JSON.stringify(exampleArray));
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
