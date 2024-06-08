import {pool} from '../db_connection.js'; // Ensure correct path to your database connection file
import bcrypt from 'bcryptjs';

const User = {
    async findByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
        return rows[0]; // Assuming username is unique, so we return the first row
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
        return rows[0]; // Assuming id is primary key, so we return the first row
    },

    async create(username, email, password) {
        const hashedPassword = bcrypt.hashSync(password.toString(), 10); // Ensure password is a string
        const [result] = await pool.query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        return result.insertId; // Return the ID of the newly inserted user
    }
};

export default User;
