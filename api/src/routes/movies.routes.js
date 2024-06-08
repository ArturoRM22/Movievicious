import {Router} from 'express';
import {methods as moviesController} from '../controllers/movies.controllers.js';

const router  = Router();

router.get('/health', moviesController.testConnection);

router.get('/movie/:id', moviesController.getMovieDetails);

router.get('/popular/:page', moviesController.getPopularMovies);

router.get('/users', moviesController.getUserDetails);

router.post('/rank', moviesController.postUserRanked);

router.get('/user-ranks/:id', moviesController.getUserRanksWithDetails);

export default router;