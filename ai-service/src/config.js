const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log({
    PORT_AI_SERVICE: process.env.PORT_AI_SERVICE,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

const PORT_AI_SERVICE = process.env.PORT_AI_SERVICE || 4001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

module.exports = {
    PORT_AI_SERVICE,
    OPENAI_API_KEY
};