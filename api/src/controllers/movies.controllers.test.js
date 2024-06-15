// __tests__/movies.controllers.test.js

const { methods: moviesController } = require('../controllers/movies.controllers.js'); // Ensure correct path to your movies.controllers.js
const { pool } = require('../db_connection.js'); // Ensure correct path to your db_connection.js
const axios = require('axios');
const jestMock = require('jest-mock'); // Using jest-mock to avoid using ES6 import

jest.mock('../db_connection.js', () => ({
    pool: {
      query: jest.fn(),
    },
  }));

jest.mock('axios');

describe('Movies Controllers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('testConnection', () => {
        it('should return healthy status', async () => {
            pool.query.mockResolvedValueOnce([[1]]);

            const req = {};
            const res = {
                status: jestMock.fn().mockReturnThis(),
                json: jestMock.fn()
            };

            await moviesController.testConnection(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT 1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'healthy' });
        });

        it('should return unhealthy status on error', async () => {
            const error = new Error('Database error');
            pool.query.mockRejectedValueOnce(error);

            const req = {};
            const res = {
                status: jestMock.fn().mockReturnThis(),
                json: jestMock.fn()
            };

            await moviesController.testConnection(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT 1');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'unhealthy', error: error.message });
        });
    });

    describe('getPopularMovies', () => {
        it('should return popular movies data', async () => {
            const page = 1;
            const mockData = { results: [{ id: 1, title: 'Popular Movie' }] };
            axios.request.mockResolvedValueOnce({ data: mockData });

            const req = { params: { page } };
            const res = {
                status: jestMock.fn().mockReturnThis(),
                json: jestMock.fn()
            };

            await moviesController.getPopularMovies(req, res);

            expect(axios.request).toHaveBeenCalledWith(expect.objectContaining({
                url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it('should handle API request errors', async () => {
            const page = 1;
            const error = new Error('API error');
            axios.request.mockRejectedValueOnce(error);

            const req = { params: { page } };
            const res = {
                status: jestMock.fn().mockReturnThis(),
                json: jestMock.fn()
            };

            await moviesController.getPopularMovies(req, res);

            expect(axios.request).toHaveBeenCalledWith(expect.objectContaining({
                url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`
            }));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('postUserRanked', () => {
        it('should add or update a user ranking', async () => {
            const req = { body: { user_id: 1, tmdb_id: 1, ranking: 5 } };
            const res = {
                status: jestMock.fn().mockReturnThis(),
                json: jestMock.fn()
            };

            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            await moviesController.postUserRanked(req, res);

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO Ranks (user_id, tmdb_id, ranking) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ranking = ?',
                [1, 1, 5, 5]
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Ranking added successfully' });
        });

        it('should handle database errors', async () => {
            const req = { body: { user_id: 1, tmdb_id: 1, ranking: 5 } };
            const res = {
                status: jestMock.fn().mockReturnThis(),
                json: jestMock.fn()
            };

            const error = new Error('Database error');
            pool.query.mockRejectedValueOnce(error);

            await moviesController.postUserRanked(req, res);

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO Ranks (user_id, tmdb_id, ranking) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ranking = ?',
                [1, 1, 5, 5]
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Failed to add ranking' });
        });
    });

/*     describe('getUserRanksWithDetails', () => {
        it('should return user ranks with movie details', async () => {
            const user_id = 4;
            const mockRanks = [{ id: 4, tmdb_id: 5000, ranking: 5 }];
            const mockMovieDetails = { id: 5000, title: 'Test Movie' };

            pool.query.mockResolvedValueOnce([mockRanks]);
            moviesController.getMovieDetails = jestMock.fn().mockResolvedValue(mockMovieDetails);

            const req = { params: { id: user_id } };
            const res = {
                status: jestMock.fn().mockReturnThis(),
                json: jestMock.fn()
            };

            await moviesController.getUserRanksWithDetails(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT id, tmdb_id, ranking FROM Ranks WHERE user_id = ?', [user_id]);
            expect(moviesController.getMovieDetails).toHaveBeenCalledWith(mockRanks[0].tmdb_id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: [{
                    ...mockRanks[0],
                    movieDetails: mockMovieDetails
                }]
            });
        });

        it('should handle database query errors', async () => {
            const user_id = 1;
            const error = new Error('Database query error');

            pool.query.mockRejectedValueOnce(error);

            const req = { params: { id: user_id } };
            const res = {                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await moviesController.getUserRanksWithDetails(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT id, tmdb_id, ranking FROM Ranks WHERE user_id = ?', [user_id]);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Failed to get ranks with movie details' });
        });
    }); */

    describe('deleteRanking', () => {
        it('should delete a user ranking', async () => {
            const rank_id = 1;

            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const req = { params: { id: rank_id } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await moviesController.deleteRanking(req, res);

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM Ranks WHERE id = ?', [rank_id]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ranking deleted successfully' });
        });

        it('should handle errors during ranking deletion', async () => {
            const rank_id = 1;
            const error = new Error('Database error');

            pool.query.mockRejectedValueOnce(error);

            const req = { params: { id: rank_id } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await moviesController.deleteRanking(req, res);

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM Ranks WHERE id = ?', [rank_id]);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('updateRanking', () => {
        it('should update a user ranking', async () => {
            const rank_id = 1;
            const updatedRanking = 4;

            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const req = { params: { id: rank_id }, body: { ranking: updatedRanking } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await moviesController.updateRanking(req, res);

            expect(pool.query).toHaveBeenCalledWith('UPDATE Ranks SET ranking = ? WHERE id = ?', [updatedRanking, rank_id]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ranking updated successfully' });
        });

        it('should handle errors during ranking update', async () => {
            const rank_id = 1;
            const updatedRanking = 4;
            const error = new Error('Database error');

            pool.query.mockRejectedValueOnce(error);

            const req = { params: { id: rank_id }, body: { ranking: updatedRanking } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await moviesController.updateRanking(req, res);

            expect(pool.query).toHaveBeenCalledWith('UPDATE Ranks SET ranking = ? WHERE id = ?', [updatedRanking, rank_id]);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
});