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

/**
 * Converts a camelCase string to UPPER_SNAKE_CASE.
 * @example toUpperSnakeCase('helloWorld'); // returns 'HELLO_WORLD'
 */
const toUpperSnakeCase = str => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
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
      const msg = `\x1b[33m${name} not found. Please set your prompt in ${path}\x1b[0m`;
      logErrorAndExit(msg);
    }
  } catch (error) {
    logErrorAndExit(`Error importing ${name}: ${error.message}`);
  }
};

/**
 * Asynchronously checks the presence of required files and logs errors to the console if any are missing.
 * Skips any file types that are not recognized.
 *
 * @async
 * @param {Array<'trainingPrompt' | 'transformPrompt' | 'trainingInputs' | 'trainingExamples' | 'trainingData'>} fileNames - The types of files to check for their presence. Providing an empty array or a non-array will result in a log message indicating no files to check.
 * @returns {void} Does not return any value. Side effect: logs messages to the console.
 * @throws {Error} Does not throw an error, but may log errors and terminate the process through an internal function (`logErrorAndExit`).
 *
 * @example
 * await checkRequiredFiles(['trainingPrompt', 'trainingData']);
 */
export const checkRequiredFiles = async fileNames => {
  if (!Array.isArray(fileNames) || !fileNames.length) {
    return console.log('No files to check. Please provide a list of files.');
  }

  for (const fileName of fileNames) {
    const pathKey = toUpperSnakeCase(fileName);
    const path = PATHS[pathKey];
    if (path) await checkFile(fileName, path);
  }
};
