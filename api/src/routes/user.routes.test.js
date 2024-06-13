// /src/routes/user.routes.test.js
import request from 'supertest';
import express from 'express';
import router from './user.routes.js'; // Ensure correct path to your user.routes.js
import { methods as usersController } from '../controllers/user.controllers.js'; // Ensure correct path to your user.controllers.js

// Mock the controller methods
jest.mock('../controllers/user.controllers.js', () => ({
    methods: {
        getUserDetails: jest.fn(),
        insertUser: jest.fn(),
        logIn: jest.fn(),
        // logOut: jest.fn(), // Uncomment if you have a logOut method
    }
}));

// Initialize the express app
const app = express();
app.use(express.json());
app.use(router);

describe('User Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /users', () => {
        it('should call getUserDetails controller', async () => {
            usersController.getUserDetails.mockImplementation((req, res) => {
                res.status(200).json({ message: 'User details' });
            });

            const response = await request(app).get('/users');

            expect(usersController.getUserDetails).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'User details' });
        });
    });

    describe('POST /register', () => {
        it('should call insertUser controller', async () => {
            usersController.insertUser.mockImplementation((req, res) => {
                res.status(201).json({ message: 'User registered' });
            });

            const response = await request(app).post('/register').send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });

            expect(usersController.insertUser).toHaveBeenCalled();
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'User registered' });
        });
    });

    describe('POST /login', () => {
        it('should call logIn controller', async () => {
            usersController.logIn.mockImplementation((req, res) => {
                res.status(200).json({ message: 'User logged in' });
            });

            const response = await request(app).post('/login').send({
                username: 'testuser',
                password: 'password123'
            });

            expect(usersController.logIn).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'User logged in' });
        });
    });

    // Uncomment and update the following test if you have a logOut method
    // describe('POST /logout', () => {
    //     it('should call logOut controller', async () => {
    //         usersController.logOut.mockImplementation((req, res) => {
    //             res.status(200).json({ message: 'User logged out' });
    //         });

    //         const response = await request(app).post('/logout');

    //         expect(usersController.logOut).toHaveBeenCalled();
    //         expect(response.status).toBe(200);
    //         expect(response.body).toEqual({ message: 'User logged out' });
    //     });
    // });
});
