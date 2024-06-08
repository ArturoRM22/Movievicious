import {Router} from 'express';
import {methods as moviesController} from '../controllers/movies.controllers.js';
import {methods as usersController} from '../controllers/user.controllers.js';

const router  = Router();

router.get('/health', moviesController.testConnection);

router.get('/movie/:id', moviesController.getMovieDetails);

router.get('/popular/:page', moviesController.getPopularMovies);

router.post('/rank', moviesController.postUserRanked);

router.get('/user-ranks/:id', moviesController.getUserRanksWithDetails);

/* ------- */
//Users

router.get('/users', usersController.getUserDetails);

router.post('/registrer', usersController.insertUser);


export default router;