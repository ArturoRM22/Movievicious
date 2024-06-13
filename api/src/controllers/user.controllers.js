import User from '../models/User.js';  // Adjust the path as needed
import {pool} from '../db_connection.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Secret key for JWT
const jwtSecret = 'your_jwt_secret';

// Registration route
const insertUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        // Create new user
        const userId = await User.create(username, email, password);
        res.status(201).json({ message: 'User registered successfully!', userId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const logIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Replace with your own logic to find user by username
        const user = await User.findByUsername(username);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users');
        console.log(rows)
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
    }
};

export const methods = {
  insertUser,
  logIn,
  getUserDetails
};
