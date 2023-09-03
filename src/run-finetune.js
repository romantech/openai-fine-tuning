import fs from 'fs';
import {
  checkEnv,
  openaiAPI,
  PATHS,
  sleep,
  STATUS,
  WAIT_INTERVAL_MS,
} from './misc/index.js';

checkEnv();

const awaitFileProcessing = async fileId => {
  while (true) {
    console.log('Waiting for file to process...');
    const fileHandle = await openaiAPI.files.retrieve(fileId);

    if (fileHandle.status === STATUS.FILE_PROCESSED) {
      console.log('File processed');
      break;
    }

    await sleep(WAIT_INTERVAL_MS);
  }
};

const awaitFineTuningJob = async jobId => {
  while (true) {
    console.log('Waiting for fine-tuning to complete...');
    const jobHandle = await openaiAPI.fineTuning.jobs.retrieve(jobId);

    if (jobHandle.status === STATUS.JOB_SUCCEEDED) {
      console.log('Fine-tuning complete');
      console.log('Fine-tuned model info:', jobHandle);
      console.log('Model id:', jobHandle.fine_tuned_model);
      break;
    }

    await sleep(WAIT_INTERVAL_MS);
  }
};

const executeFineTuning = async () => {
  // Upload file
  const fileUpload = await openaiAPI.files.create({
    file: fs.createReadStream(PATHS.TRAINING_DATA),
    purpose: 'fine-tune',
  });

  const fileId = fileUpload.id;
  console.log('Uploaded file id:', fileId);

  // Wait for file to be processed
  await awaitFileProcessing(fileId);

  // Start fine-tuning
  const job = await openaiAPI.fineTuning.jobs.create({
    training_file: fileId,
    model: 'gpt-3.5-turbo',
  });

  const jobId = job.id;
  console.log('Fine-tuning job id:', jobId);

  // Wait for fine-tuning to complete
  await awaitFineTuningJob(jobId);
};

executeFineTuning().catch(console.error);
