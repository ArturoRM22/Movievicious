const express = require('express');
const moviesController = require('../controllers/movies.controllers.js').methods;
const aiController = require('../controllers/ai.controllers.js').methods;

const router = express.Router();

router.get('/health', moviesController.testConnection);

router.get('/movie/:id', moviesController.getMovieDetails);

router.get('/popular/:page', moviesController.getPopularMovies);

router.post('/rank', moviesController.postUserRanked);

router.get('/user-ranks/:id', moviesController.getUserRanksWithDetails);

router.delete('/delete-ranking/:id', moviesController.deleteRanking);

router.patch('/update-ranking/:id', moviesController.updateRanking);

router.get('/recommendations/:userId', aiController.getPersonalizedRecommendationsHandler);

module.exports = router;
