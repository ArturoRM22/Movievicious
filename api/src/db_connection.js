import {createPool} from 'mysql2/promise'
import {DB_PORT, USER, DATABASE, PASSWORD, HOST, DB_DOCKER_HOST} from './config.js';
export const pool = createPool({
    host: DB_DOCKER_HOST, //Make sure you put localhost instead of DB_DOCKER_HOST if you are running locally
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: DB_PORT
})