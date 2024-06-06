import {createPool} from 'mysql2/promise'
import {DB_PORT, USER, DATABASE, PASSWORD, HOST} from './config.js';
export const pool = createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: DB_PORT
})