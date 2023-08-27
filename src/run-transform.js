import fs, { promises as fsp } from 'fs';
import { trainingPrompt } from './data/training-prompt.js';
import { checkEnv } from './misc/env-checker.js';
import { trainingDataPath, trainingExamplesPath } from './misc/file-paths.js';

checkEnv();

const transformPrompt = trainingPrompt; // TODO Change this to your own prompt

async function readJSONFile(filePath) {
  try {
    const data = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading the file ${filePath}:`, err);
    throw err;
  }
}

async function writeFormattedMessages(examples, outputFilePath) {
  const writeStream = fs.createWriteStream(outputFilePath);

  writeStream
    .on('finish', () => {
      console.log(`Successfully wrote to ${outputFilePath}`);
    })
    .on('error', err => {
      console.error(`Error writing to the file ${outputFilePath}:`, err);
      writeStream.end();
    });

  for (const example of examples) {
    const exampleString = JSON.stringify(example);
    const formattedMessage = {
      messages: [
        { role: 'system', content: transformPrompt },
        { role: 'assistant', content: exampleString },
      ],
    };
    writeStream.write(JSON.stringify(formattedMessage) + '\n');
  }

  writeStream.end();
}

async function transform() {
  try {
    const examples = await readJSONFile(trainingExamplesPath);
    await writeFormattedMessages(examples, trainingDataPath);
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

await transform();
