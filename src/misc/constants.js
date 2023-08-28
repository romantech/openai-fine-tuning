import path from 'path';

export const __dirname = path.resolve();

export const PATHS = {
  TRAINING_EXAMPLES: path.join(__dirname, 'src/data/training-examples.json'),
  TRAINING_DATA: path.join(__dirname, 'src/data/training-data.jsonl'),
  TRAINING_PROMPT: path.join(__dirname, 'src/data/training-prompt.js'),
  TRANSFORM_PROMPT: path.join(__dirname, 'src/data/transform-prompt.js'),
  TRAINING_INPUT_LIST: path.join(
    __dirname,
    'src/data/training-input-list.json',
  ),
};

export const STATUS = {
  FILE_PROCESSED: 'processed',
  JOB_SUCCEEDED: 'succeeded',
};

export const WAIT_INTERVAL_MS = 3000;
