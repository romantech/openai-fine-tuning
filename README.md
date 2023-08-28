# OpenAI Fine-tuning for JSON Output

## Introduction

This project, written in JavaScript (Node.js), fine-tunes OpenAI's primary models to produce JSON-formatted output. It aims to enhance both cost-efficiency and data consistency for applications that utilize the OpenAI API. Portions of the codebase are inspired by the Python [open-finetuning](https://github.com/horosin/open-finetuning).


## Prerequisites
- Node.js 16 LTS or later
- OpenAI Node v4

## Usage

### Step 1: Set OpenAI API Key Environment Variable
Define your OpenAI API key by setting an environment variable named `API_KEY`.
```bash
export API_KEY=your-openai-api-key
```

### Step 2: Generate Sample Training Data
- Execute `npm run prepare`.
- Use a prompt capable of generating the desired output.
- For optimal sample quality, it is recommended to use GPT-4.
- OpenAI requires a minimum of `50` samples.
- The sample data will be stored in `src/data/training-examples.json`.

### Step 3: Generate System Message Formatting Data
- Execute `npm run transform`.
- Use a more straightforward prompt than the previous step.
- The results will be saved in `src/data/training-data.jsonl`.

### Step 4: Proceed with Fine-tuning
- Execute `npm run finetune`.
- Upon completion, the fine-tuned model ID will be displayed on the console.

### Step 5: Test the Fine-tuned Model
- Execute `npm run model`.
- Test the model using a simplified version of the original prompt.
