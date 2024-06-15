// __tests__/user.controllers.test.js

const { methods: userController } = require('../controllers/user.controllers.js');
const User = require('../models/User.js');
const { pool } = require('../db_connection.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jestMock = require('jest-mock'); // Using jest-mock to avoid using ES6 import

// Mocking dependencies
jest.mock('../models/User.js');
jest.mock('../db_connection.js');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jestMock.fn().mockReturnThis(),
            json: jestMock.fn().mockReturnThis()
        };
    });

    describe('insertUser', () => {
        it('should register a new user successfully', async () => {
            req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
            User.findByUsername.mockResolvedValue(null);
            User.create.mockResolvedValue(1);

            await userController.insertUser(req, res);

            expect(User.findByUsername).toHaveBeenCalledWith('testuser');
            expect(User.create).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully!', userId: 1 });
        });

        it('should return an error if username is already taken', async () => {
            req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
            User.findByUsername.mockResolvedValue({});

            await userController.insertUser(req, res);

            expect(User.findByUsername).toHaveBeenCalledWith('testuser');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Username already taken.' });
        });

        it('should handle server errors', async () => {
            req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
            User.findByUsername.mockRejectedValue(new Error('Database error'));

            await userController.insertUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
        });
    });

    describe('logIn', () => {
        it('should log in a user and return a token', async () => {
            req.body = { username: 'testuser', password: 'password123' };
            const mockUser = { id: 1, password: 'hashedpassword' };
            User.findByUsername.mockResolvedValue(mockUser);
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token123');

            await userController.logIn(req, res);

            expect(User.findByUsername).toHaveBeenCalledWith('testuser');
            expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'your_jwt_secret', { expiresIn: '1h' });
            expect(res.json).toHaveBeenCalledWith({ token: 'token123' });
        });

        it('should return an error for incorrect username or password', async () => {
            req.body = { username: 'testuser', password: 'password123' };
            User.findByUsername.mockResolvedValue(null);

            await userController.logIn(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Incorrect username or password' });
        });

        it('should handle server errors', async () => {
            req.body = { username: 'testuser', password: 'password123' };
            User.findByUsername.mockRejectedValue(new Error('Database error'));

            await userController.logIn(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('getUserDetails', () => {
        it('should fetch user details successfully', async () => {
            const mockUsers = [{ id: 1, username: 'testuser' }];
            pool.query.mockResolvedValue([mockUsers]);

            await userController.getUserDetails(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Users');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', data: mockUsers });
        });

        it('should handle server errors', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            await userController.getUserDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Failed to fetch users' });
        });
    });
});