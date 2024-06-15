import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
config({ path: resolve(__dirname, '../../.env') });

console.log({
    PORT_AI_SERVICE: process.env.PORT_AI_SERVICE,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
})

export const PORT_AI_SERVICE = process.env.PORT_AI_SERVICE || 4001;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;