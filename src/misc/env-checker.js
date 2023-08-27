import dotenv from 'dotenv';

export const checkEnv = () => {
  dotenv.config();

  const msg = 'API Key not found. Please set your API key in the .env file.';

  if (!process.env.API_KEY) {
    console.error(msg);
    process.exit(1);
  }
};
