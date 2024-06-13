// /src/routes/movies.routes.test.js
import request from 'supertest';
import express from 'express';
import router from './movies.routes.js'; // Ensure correct path to your movies.routes.js
import { methods as moviesController } from '../controllers/movies.controllers.js'; // Ensure correct path to your movies.controllers.js

// Mock the controller methods
jest.mock('../controllers/movies.controllers.js', () => ({
    methods: {
        testConnection: jest.fn(),
        getMovieDetails: jest.fn(),
        getPopularMovies: jest.fn(),
        postUserRanked: jest.fn(),
        getUserRanksWithDetails: jest.fn(),
        deleteRanking: jest.fn(),
        updateRanking: jest.fn(),
    }
}));

// Initialize the express app
const app = express();
app.use(express.json());
app.use(router);

describe('Movies Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /health', () => {
        it('should call testConnection controller', async () => {
            moviesController.testConnection.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Connection OK' });
            });

            const response = await request(app).get('/health');

            expect(moviesController.testConnection).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Connection OK' });
        });
    });

    describe('GET /movie/:id', () => {
        it('should call getMovieDetails controller', async () => {
            const mockMovie = { id: 1, title: 'Test Movie' };
            moviesController.getMovieDetails.mockImplementation((req, res) => {
                res.status(200).json(mockMovie);
            });

            const response = await request(app).get('/movie/1');

            expect(moviesController.getMovieDetails).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMovie);
        });
    });

    describe('GET /popular/:page', () => {
        it('should call getPopularMovies controller', async () => {
            const mockMovies = [{ id: 1, title: 'Test Movie' }];
            moviesController.getPopularMovies.mockImplementation((req, res) => {
                res.status(200).json(mockMovies);
            });

            const response = await request(app).get('/popular/1');

            expect(moviesController.getPopularMovies).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMovies);
        });
    });

    describe('POST /rank', () => {
        it('should call postUserRanked controller', async () => {
            moviesController.postUserRanked.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Rank saved' });
            });

            const response = await request(app).post('/rank').send({
                movieId: 1,
                userId: 1,
                rank: 5
            });

            expect(moviesController.postUserRanked).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Rank saved' });
        });
    });

    describe('GET /user-ranks/:id', () => {
        it('should call getUserRanksWithDetails controller', async () => {
            const mockRanks = [{ id: 1, movieId: 1, rank: 5 }];
            moviesController.getUserRanksWithDetails.mockImplementation((req, res) => {
                res.status(200).json(mockRanks);
            });

            const response = await request(app).get('/user-ranks/1');

            expect(moviesController.getUserRanksWithDetails).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRanks);
        });
    });

    describe('DELETE /delete-ranking/:id', () => {
        it('should call deleteRanking controller', async () => {
            moviesController.deleteRanking.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Rank deleted' });
            });

            const response = await request(app).delete('/delete-ranking/1');

            expect(moviesController.deleteRanking).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Rank deleted' });
        });
    });

    describe('PATCH /update-ranking/:id', () => {
        it('should call updateRanking controller', async () => {
            moviesController.updateRanking.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Rank updated' });
            });

            const response = await request(app).patch('/update-ranking/1').send({
                rank: 4
            });

            expect(moviesController.updateRanking).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Rank updated' });
        });
    });
});
