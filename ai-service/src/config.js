import {config} from 'dotenv';

config();

export const PORT = process.env.PORT || 4000;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;