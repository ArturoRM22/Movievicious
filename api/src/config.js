import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
config({ path: resolve(__dirname, '../../.env') });

console.log({
    PORT: process.env.PORT,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    HOST: process.env.HOST,
    DATABASE: process.env.DATABASE,
    DB_PORT: process.env.DB_PORT,
    ACCESS_TOKEN_AUTH: process.env.ACCESS_TOKEN_AUTH,
    DB_DOCKER_HOST: process.env.DB_DOCKER_HOST,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AI_DOCKER_HOST: process.env.AI_DOCKER_HOST,
})

export const PORT = process.env.PORT || 4000;
export const USER = process.env.USER || 'root';
export const PASSWORD = process.env.PASSWORD || '';
export const HOST = process.env.HOST || 'localhost';
export const DATABASE = process.env.DATABASE || 'movicious';
export const DB_PORT = process.env.DB_PORT || '3306';
export const ACCESS_TOKEN_AUTH = process.env.ACCESS_TOKEN_AUTH;
export const DB_DOCKER_HOST = process.env.DB_DOCKER_HOST;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const AI_DOCKER_HOST = process.env.AI_DOCKER_HOST;
