import { checkEnv, checkRequiredFiles, openaiAPI } from './misc/index.js';
import { transformPrompt } from './data/index.js';

checkEnv();
await checkRequiredFiles(['transformPrompt']);

const model = ''; // TODO: Replace with your fine-tuned model id
const content = ''; // TODO: Replace with your user input

const fetchCompletion = async () => {
  try {
    const response = await openaiAPI.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: transformPrompt },
        { role: 'user', content },
      ],
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
};

await fetchCompletion();
