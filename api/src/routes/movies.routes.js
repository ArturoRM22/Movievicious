import {Router} from 'express';
import {methods as moviesController} from '../controllers/movies.controllers.js';
import {methods as usersController} from '../controllers/user.controllers.js';

const router  = Router();

router.get('/health', moviesController.testConnection);

router.get('/movie/:id', moviesController.getMovieDetails);

router.get('/popular/:page', moviesController.getPopularMovies);

router.post('/rank', moviesController.postUserRanked);

router.get('/user-ranks/:id', moviesController.getUserRanksWithDetails);

router.delete('/delete-ranking/:id', moviesController.deleteRanking);

router.patch('/update-ranking/:id', moviesController.updateRanking);

export default router;