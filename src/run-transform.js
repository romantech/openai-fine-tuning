import fs, { promises as fsp } from 'fs';
import { transformPrompt } from './data/index.js';
import { checkEnv, checkRequiredFiles, PATHS } from './misc/index.js';

checkEnv();
await checkRequiredFiles(['transformPrompt']);

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
    const { sentence } = example; // TODO: Change to your own data

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
    const examples = await readTrainingDataJSON(PATHS.TRAINING_EXAMPLES);
    await writeAndFormatTrainingMessages(examples, PATHS.TRAINING_DATA);
  } catch (err) {
    console.error('An error occurred:', err);
  }
};

await transform();
