import fs from 'fs';
import { transformPrompt } from './data/index.js';
import { checkEnv, checkRequiredFiles, PATHS, readJSON } from './misc/index.js';

checkEnv();
await checkRequiredFiles(['transformPrompt']);

const formatAndWrite = async (examples, outputPath) => {
  const writeStream = fs.createWriteStream(outputPath);

  writeStream
    .on('finish', () => {
      console.log(`Successfully wrote to ${outputPath}`);
    })
    .on('error', err => {
      console.error(`Error writing to the file ${outputPath}:`, err);
      writeStream.end();
    });

  for (const example of examples) {
    const { sentence } = example; // TODO: Change to your own user input

    const system = { role: 'system', content: transformPrompt };
    const user = { role: 'user', content: JSON.stringify(sentence) };
    const assistant = { role: 'assistant', content: JSON.stringify(example) };

    const formatted = { messages: [system, user, assistant] };
    writeStream.write(JSON.stringify(formatted) + '\n');
  }

  writeStream.end();
};

const transform = async () => {
  try {
    const examples = await readJSON(PATHS.TRAINING_EXAMPLES);
    await formatAndWrite(examples, PATHS.TRAINING_DATA);
  } catch (err) {
    console.error('An error occurred:', err);
  }
};

await transform();
