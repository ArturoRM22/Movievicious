import { getUserRanksWithDetailsService } from './movies.controllers.js';
import { getPersonalizedRecommendations } from './ai.Service.js';


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

        // Get recommendations from GPT
        const recommendations = await getPersonalizedRecommendations(userRankings);
        res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Error fetching recommendations from GPT:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
};

export const methods = {
    getPersonalizedRecommendationsHandler
};