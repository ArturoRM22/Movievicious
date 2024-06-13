// /src/models/User.test.js
import { pool } from '../db_connection.js'; // Ensure correct path to your database connection file
import bcrypt from 'bcryptjs';
import User from './User'; // Ensure correct path to your User model file

jest.mock('../db_connection.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
}));

describe('User Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'testuser@example.com' };
      pool.query.mockResolvedValueOnce([[mockUser]]);

      const user = await User.findByUsername('testuser');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE username = ?', ['testuser']);
      expect(user).toEqual(mockUser);
    });

    it('should return undefined when no user is found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const user = await User.findByUsername('nonexistentuser');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE username = ?', ['nonexistentuser']);
      expect(user).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'testuser@example.com' };
      pool.query.mockResolvedValueOnce([[mockUser]]);

      const user = await User.findById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE id = ?', [1]);
      expect(user).toEqual(mockUser);
    });

    it('should return undefined when no user is found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const user = await User.findById(999);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE id = ?', [999]);
      expect(user).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new user and return the insertId', async () => {
      const username = 'newuser';
      const email = 'newuser@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      bcrypt.hashSync.mockReturnValueOnce(hashedPassword);
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const insertId = await User.create(username, email, password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      expect(insertId).toBe(1);
    });
  });
});
