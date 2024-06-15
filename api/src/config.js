const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
});

const PORT = process.env.PORT || 4000;
const USER = process.env.USER || 'root';
const PASSWORD = process.env.PASSWORD || '';
const HOST = process.env.HOST || 'localhost';
const DATABASE = process.env.DATABASE || 'movicious';
const DB_PORT = process.env.DB_PORT || '3306';
const ACCESS_TOKEN_AUTH = process.env.ACCESS_TOKEN_AUTH;
const DB_DOCKER_HOST = process.env.DB_DOCKER_HOST;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AI_DOCKER_HOST = process.env.AI_DOCKER_HOST;

module.exports = {
    PORT,
    USER,
    PASSWORD,
    HOST,
    DATABASE,
    DB_PORT,
    ACCESS_TOKEN_AUTH,
    DB_DOCKER_HOST,
    OPENAI_API_KEY,
    AI_DOCKER_HOST
};