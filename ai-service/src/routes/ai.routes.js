const express = require('express');
const aiController = require('../controllers/ai.Service.js').methods;

const router = express.Router();

router.post('/recommendations', aiController.handleRecommendations);

module.exports = router;
