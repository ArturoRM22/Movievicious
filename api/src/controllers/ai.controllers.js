const { getUserRanksWithDetailsService } = require('./movies.controllers.js');
const axios = require('axios');
const { AI_DOCKER_HOST } = require('../config.js');

const getPersonalizedRecommendationsHandler = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch user rankings with movie details
        const userRanksWithDetails = await getUserRanksWithDetailsService(userId);

        // Check if user rankings are empty
        if (userRanksWithDetails.length === 0) {
            return res.status(200).json({ recommendations: 'No rankings found for the user.' });
        }

        // Extract relevant data for GPT prompt
        const userRankings = userRanksWithDetails.map(rank => ({
            movie: rank.movieDetails.title,
            ranking: rank.ranking
        }));

        console.log("User rankings: ", userRankings);

        // Make a POST request to the AI microservice, make sure you put localhost instead of AI_DOCKER_HOST if you are running locally
        const response = await axios.post(`http://${AI_DOCKER_HOST}:3002/AI/recommendations`, { userRankings });
        const recommendations = response.data;
        res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Error fetching recommendations from GPT:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
};

const methods = {
    getPersonalizedRecommendationsHandler
};

module.exports = {
    methods
};