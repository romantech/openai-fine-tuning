import fs, { promises as fsp } from 'fs';
import { transformPrompt as prompt } from './data/transform-prompt.js';
import { checkEnv } from './misc/env-checker.js';
import { trainingDataPath, trainingExamplesPath } from './misc/file-paths.js';

checkEnv();

const transformPrompt = prompt; // TODO Change this to your own prompt

const readTrainingDataJSON = async filePath => {
  try {
    const data = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading the file ${filePath}:`, err);
    throw err;
  }
};

const writeAndFormatTrainingMessages = async (examples, outputFilePath) => {
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
    const serializedExample = JSON.stringify(example);
    const formattedMessage = {
      messages: [
        { role: 'system', content: transformPrompt },
        { role: 'assistant', content: serializedExample },
      ],
    };

    writeStream.write(JSON.stringify(formattedMessage) + '\n');
  }

  writeStream.end();
};

const transform = async () => {
  try {
    const examples = await readTrainingDataJSON(trainingExamplesPath);
    await writeAndFormatTrainingMessages(examples, trainingDataPath);
  } catch (err) {
    console.error('An error occurred:', err);
  }
};

await transform();
