import dotenv from 'dotenv';
import { PATHS } from './constants.js';

dotenv.config();

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const logErrorAndExit = (msg, code = 1) => {
  console.error(msg);
  process.exit(1);
};

export const checkEnv = () => {
  const msg = 'API Key not found. Please set your API key in the .env file.';

  if (!process.env.API_KEY) logErrorAndExit(msg);
};

const checkFile = async (file, path) => {
  try {
    const imported = await import('../data/index.js').then(
      module => module[file],
    );

    if (!imported) {
      const msg = `\x1b[33mAn ${file} not found. Please set your prompt in ${path}\x1b[0m`;
      logErrorAndExit(msg);
    }
  } catch (error) {
    logErrorAndExit(`Error importing ${file}: ${error.message}`);
  }
};

/**
 * Checks the presence of required files and logs errors when necessary.
 *
 * @param {Array<'trainingPrompt' | 'transformPrompt' | 'trainingInputList'>} checkTypes - The types of files to check.
 */
export const checkRequiredFiles = async checkTypes => {
  if (!Array.isArray(checkTypes) || !checkTypes.length) {
    return console.log('No files to check. Please provide a list of files.');
  }

  const list = {
    trainingPrompt: () => checkFile('trainingPrompt', PATHS.TRAINING_PROMPT),
    transformPrompt: () => checkFile('transformPrompt', PATHS.TRANSFORM_PROMPT),
    trainingInputList: () =>
      checkFile('trainingInputList', PATHS.TRAINING_INPUT_LIST),
  };

  for (const type of checkTypes) {
    if (list[type]) await list[type]();
  }
};
