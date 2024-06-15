// __tests__/users.routes.test.js

const request = require('supertest');
const express = require('express');
const usersRouter = require('../routes/user.routes.js');
const usersController = require('../controllers/user.controllers.js').methods;

jest.mock('../controllers/user.controllers.js', () => ({
  methods: {
    getUserDetails: jest.fn(),
    insertUser: jest.fn(),
    logIn: jest.fn(),
  },
}));

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/', usersRouter);

describe('Users Routes', () => {
  describe('GET /users', () => {
    it('should return user details', async () => {
      const mockUserDetails = { id: 1, name: 'John Doe' };
      usersController.getUserDetails.mockImplementation((req, res) => res.json(mockUserDetails));

      const res = await request(app).get('/users');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockUserDetails);
      expect(usersController.getUserDetails).toHaveBeenCalled();
    });
  });

  describe('POST /register', () => {
    it('should insert a user', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      usersController.insertUser.mockImplementation((req, res) => res.status(201).json(mockUser));

      const res = await request(app).post('/register').send({ name: 'John Doe' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockUser);
      expect(usersController.insertUser).toHaveBeenCalled();
    });
  });

  describe('POST /login', () => {
    it('should log in a user', async () => {
      const mockLoginResponse = { token: 'abcd1234' };
      usersController.logIn.mockImplementation((req, res) => res.json(mockLoginResponse));

      const res = await request(app).post('/login').send({ username: 'john', password: 'password' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockLoginResponse);
      expect(usersController.logIn).toHaveBeenCalled();
    });
  });
});
