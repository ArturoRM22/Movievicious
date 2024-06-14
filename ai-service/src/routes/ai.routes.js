import {Router} from 'express';
import {methods as aiController} from '../controllers/ai.Service.js';

const router  = Router();

router.post('/recommendations', aiController.handleRecommendations);

export default router;
