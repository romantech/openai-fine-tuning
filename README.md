# OpenAI Fine-tuning for JSON Output

## Introduction

This is an example project that fine-tunes OpenAI's main models to output in JSON format. This project aims to reduce the cost and improve the consistency of the output data for applications utilizing OpenAI's models. Written in Javascript (Node.js), it is based on the Python [open-finetuning](https://github.com/horosin/open-finetuning) repository.

## Prerequisites
- Node.js 16 LTS or later
- OpenAI Node v4

## Usage

### Step 1: Set OpenAI API Key Environment Variable
Set your OpenAI API key as an environment variable named `API_KEY`.
```bash
export API_KEY=your-openai-api-key
```

### Step 2: Generate Sample Training Data
- Run `npm run prepare`
- Use a prompt that can produce the expected output.
- For the best sample quality, using the GPT-4 model is recommended.
- OpenAI requires a minimum of `50` samples.
- Sample data will be stored in `src/data/training-examples.json`.

### Step 3: Generate System Message Formatting Data
- Run `npm run transform`
- Use a simplified prompt compared to before.
- Results are stored in `src/data/training-data.jsonl`.

### Step 4: Proceed with Fine-tuning
- Run `npm run finetune`
- Once fine-tuning is complete, the model ID will be printed to the console.

### Step 5: Test the Fine-tuned Model
- Run `npm run model`
- Test the model using a simplified prompt.
