import {Router} from 'express';
import {methods as usersController} from '../controllers/user.controllers.js';

const router  = Router();

router.get('/users', usersController.getUserDetails);

router.post('/registrer', usersController.insertUser);

router.post('/login', usersController.logIn);

//router.post('/logout', usersController.logOut);


export default router;