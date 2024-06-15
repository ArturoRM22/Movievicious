// __tests__/movies.routes.test.js

const request = require('supertest');
const express = require('express');
const router = require('../routes/movies.routes.js');
const moviesController = require('../controllers/movies.controllers.js').methods;
// Mock the controller methods directly using jest.fn()
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

/*     describe('GET /movie/:id', () => {
        it('should call getMovieDetails controller', async () => {
            const mockMovie = { id: 5000, title: 'Test Movie' };
    
            // Mock implementation of getMovieDetails
            moviesController.getMovieDetails.mockImplementation((req, res) => {
                res.status(200).json(mockMovie);
            });
    
            // Make a request to the endpoint using supertest
            const response = await request(app).get('/movie/5000');
    
            // Assert that getMovieDetails was called with the expected arguments
            expect(moviesController.getMovieDetails).toHaveBeenCalledWith(
                expect.objectContaining({ params: { id: '5000' } }),
                expect.any(Object)
            );
    
            // Assert the response status and body
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMovie);
        });
    }); */
    
    

/*     describe('GET /popular/:page', () => {
        it('should call getPopularMovies controller', async () => {
            const mockMovies = [{ id: 1, title: 'Test Movie' }];
    
            moviesController.getPopularMovies.mockImplementation((req, res) => {
                res.status(200).json(mockMovies);
            });
    
            // Make a request to the endpoint using supertest
            const response = await request(app).get('/popular/1');
    
            // Assert that getPopularMovies was called with the expected arguments
            expect(moviesController.getPopularMovies).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: { page: '1' } // Ensure params are correctly passed
                }),
                expect.any(Object) // Ensure any response object is passed
            );
    
            // Assert the response status and body
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMovies);
        });
    }); */
    
    

    describe('POST /rank', () => {
        it('should call postUserRanked controller', async () => {
            // Mock response object for the controller
            const mockResponseData = { message: 'Rank saved' };
            moviesController.postUserRanked.mockImplementation((req, res) => {
                res.status(201).json(mockResponseData);
            });
    
            // Mock request object
            const mockRequest = {
                body: {
                    tmdb_id: 5000,
                    user_id: 4,
                    ranking: 5
                },
                app: app, // Mock the Express app if required by your controller
                // Add any other required properties as per your controller's expectations
            };
    
            // Mock response object
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };
    
            // Call the controller function
            await moviesController.postUserRanked(mockRequest, mockResponse);
    
            // Assert the response
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockResponseData);
    
            // Verify the controller function was called with the correct arguments
            expect(moviesController.postUserRanked).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: expect.objectContaining({
                        tmdb_id: 5000,
                        user_id: 4,
                        ranking: 5
                    })
                }),
                expect.any(Object) // We expect any response object with status and json functions
            );
        });
    });
    
    

/*     describe('GET /user-ranks/:id', () => {
        it('should call getUserRanksWithDetails controller', async () => {
            const mockRanks = [{ id: 1, movieId: 1, rank: 5 }];
            moviesController.getUserRanksWithDetails.mockImplementation((req, res) => {
                res.status(200).json(mockRanks);
            });

            const response = await request(app).get('/user-ranks/4');

            expect(moviesController.getUserRanksWithDetails).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRanks);
        });
    }); */

/*     describe('DELETE /delete-ranking/:id', () => {
        it('should call deleteRanking controller', async () => {
            moviesController.deleteRanking.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Rank deleted' });
            });

            const response = await request(app).delete('/delete-ranking/53');

            expect(moviesController.deleteRanking).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Rank deleted' });
        });
    }); */

/*     describe('PATCH /update-ranking/:id', () => {
        it('should call updateRanking controller', async () => {
            moviesController.updateRanking.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Rank updated' });
            });

            const response = await request(app).patch('/update-ranking/72').send({
                rank: 4
            });

            expect(moviesController.updateRanking).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Rank updated' });
        });
    }); */
});