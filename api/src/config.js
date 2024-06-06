import {config} from 'dotenv';

config();

export const PORT = process.env.PORT || 4000;
export const USER = process.env.USER || 'root';
export const PASSWORD = process.env.PASSWORD || '';
export const HOST = process.env.HOST || 'localhost';
export const DATABASE = process.env.DATABASE || 'movicious';
export const DB_PORT = process.env.DB_PORT || '3306';
