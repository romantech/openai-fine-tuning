import dotenv from 'dotenv';
import { PATHS } from './constants.js';
import { promises as fsp } from 'fs';

dotenv.config();

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const readJSON = async path => {
  try {
    const data = await fsp.readFile(path, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading the file ${path}:`, err);
    throw err;
  }
};

const logErrorAndExit = (msg, code = 1) => {
  console.error(msg);
  process.exit(1);
};

export const checkEnv = () => {
  const msg = 'API Key not found. Please set your API key in the .env file.';
  if (!process.env.API_KEY) logErrorAndExit(msg);
};

const checkFile = async (name, path) => {
  try {
    const file = await import('../data/index.js').then(module => module[name]);

    if (!file) {
      const msg = `\x1b[33mAn ${name} not found. Please set your prompt in ${path}\x1b[0m`;
      logErrorAndExit(msg);
    }
  } catch (error) {
    logErrorAndExit(`Error importing ${name}: ${error.message}`);
  }
};

const { TRAINING_PROMPT, TRANSFORM_PROMPT, TRAINING_INPUTS } = PATHS;

/**
 * Checks the presence of required files and logs errors when necessary.
 *
 * @param {Array<'trainingPrompt' | 'transformPrompt' | 'trainingInputs'>} fileNames - The types of files to check.
 */
export const checkRequiredFiles = async fileNames => {
  if (!Array.isArray(fileNames) || !fileNames.length) {
    return console.log('No files to check. Please provide a list of files.');
  }

  const list = {
    trainingPrompt: { name: 'trainingPrompt', path: TRAINING_PROMPT },
    transformPrompt: { name: 'transformPrompt', path: TRANSFORM_PROMPT },
    trainingInputs: { name: 'trainingInputs', path: TRAINING_INPUTS },
  };

  for (const fileName of fileNames) {
    const target = list[fileName];
    if (target) await checkFile(target.name, target.path);
  }
};
