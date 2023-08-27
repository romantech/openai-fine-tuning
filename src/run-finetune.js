import fs from 'fs';
import OpenAI from 'openai';
import { checkEnv } from './misc/env-checker.js';
import { trainingDataPath } from './misc/file-paths.js';

checkEnv();

const SLEEP_TIME_MS = 3000;
const STATUS_PROCESSED = 'processed';
const STATUS_SUCCEEDED = 'succeeded';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const openaiAPI = new OpenAI({ apiKey: process.env.API_KEY });

const waitForFileProcessing = async fileId => {
  while (true) {
    console.log('Waiting for file to process...');
    const fileHandle = await openaiAPI.files.retrieve(fileId);

    if (fileHandle.status === STATUS_PROCESSED) {
      console.log('File processed');
      break;
    }

    await sleep(SLEEP_TIME_MS);
  }
};

const waitForFineTuningCompletion = async jobId => {
  while (true) {
    console.log('Waiting for fine-tuning to complete...');
    const jobHandle = await openaiAPI.fineTuning.jobs.retrieve(jobId);

    if (jobHandle.status === STATUS_SUCCEEDED) {
      console.log('Fine-tuning complete');
      console.log('Fine-tuned model info:', jobHandle);
      console.log('Model id:', jobHandle.fine_tuned_model);
      break;
    }

    await sleep(SLEEP_TIME_MS);
  }
};

const fineTune = async () => {
  // Upload file
  const fileUpload = await openaiAPI.files.create({
    file: fs.createReadStream(trainingDataPath),
    purpose: 'fine-tune',
  });

  const fileId = fileUpload.id;
  console.log('Uploaded file id:', fileId);

  // Wait for file to be processed
  await waitForFileProcessing(fileId);

  // Start fine-tuning
  const job = await openaiAPI.fineTuning.jobs.create({
    training_file: fileId,
    model: 'gpt-3.5-turbo',
  });

  const jobId = job.id;
  console.log('Fine-tuning job id:', jobId);

  // Wait for fine-tuning to complete
  await waitForFineTuningCompletion(jobId);
};

fineTune().catch(console.error);
