const mysql = require('mysql2/promise');
const config = require('./config.js');

const pool = mysql.createPool({
    host: config.DB_DOCKER_HOST, // Make sure you put localhost instead of DB_DOCKER_HOST if you are running locally
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    port: config.DB_PORT
});

module.exports = {
    pool
};