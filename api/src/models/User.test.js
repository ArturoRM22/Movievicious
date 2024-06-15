// __tests__/User.test.js

const bcrypt = require('bcryptjs');
const User = require('./User.js');
const dbConnection = require('../db_connection.js');

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
      dbConnection.pool.query.mockResolvedValueOnce([[mockUser]]);

      const user = await User.findByUsername('testuser');

      expect(dbConnection.pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE username = ?', ['testuser']);
      expect(user).toEqual(mockUser);
    });

    it('should return undefined when no user is found', async () => {
      dbConnection.pool.query.mockResolvedValueOnce([[]]);

      const user = await User.findByUsername('nonexistentuser');

      expect(dbConnection.pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE username = ?', ['nonexistentuser']);
      expect(user).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'testuser@example.com' };
      dbConnection.pool.query.mockResolvedValueOnce([[mockUser]]);

      const user = await User.findById(1);

      expect(dbConnection.pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE id = ?', [1]);
      expect(user).toEqual(mockUser);
    });

    it('should return undefined when no user is found', async () => {
      dbConnection.pool.query.mockResolvedValueOnce([[]]);

      const user = await User.findById(999);

      expect(dbConnection.pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE id = ?', [999]);
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
      dbConnection.pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const insertId = await User.create(username, email, password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(dbConnection.pool.query).toHaveBeenCalledWith(
        'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      expect(insertId).toBe(1);
    });
  });
});
