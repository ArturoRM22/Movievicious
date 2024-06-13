import {createPool} from 'mysql2/promise'
import {DB_PORT, USER, DATABASE, PASSWORD, HOST, DB_DOCKER_HOST} from './config.js';
export const pool = createPool({
    host: DB_DOCKER_HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: DB_PORT
})