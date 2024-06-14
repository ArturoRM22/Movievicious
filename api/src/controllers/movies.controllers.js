import {pool} from '../db_connection.js';
import { ACCESS_TOKEN_AUTH } from '../config.js';
import axios from 'axios';


const testConnection = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1');
        res.status(200).json({ status: 'healthy' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
};


const getPopularMovies = async(req, res)=>{
    const page = req.params.page;

    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`
        }
      };
      try {
        const response = await axios.request(options);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('TMDB API request error:', error);
        res.status(500).json({ error: error.message });
    }
}

// Not working. To be implemented
const postUserRanked = async (req, res) => {
    const { user_id, tmdb_id, ranking } = req.body;
    //console.log(tmdb_id);

    try {
        const [result] = await pool.query(
            'INSERT INTO Ranks (user_id, tmdb_id, ranking) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ranking = ?',
            [user_id, tmdb_id, ranking, ranking]
        );
        //console.log(result);
        if (result.affectedRows >= 1) {
                res.status(200).json({ status: 'success', message: 'Ranking added successfully' });
        } else {
            res.status(500).json({ status: 'error', message: 'Failed to add ranking' });
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to add ranking' });
    }
};


const getMovieDetails = async (movieId) => {
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${movieId}`,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN_AUTH}`
        }
    };

    try {
        const response = await axios.request(options);
        return response.data; // Return the movie details
    } catch (error) {
        console.error('TMDB API request error:', error);
        throw new Error('Failed to fetch movie details from TMDB');
    }
};

const getUserRanksWithDetails = async (req, res) => {
    const user_id = req.params.id;

    try {
        const ranksWithDetails = await getUserRanksWithDetailsService(user_id);
        res.status(200).json({ status: 'success', data: ranksWithDetails });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to get ranks with movie details' });
    }
};

const deleteRanking = async (req, res) => {
    const rank_id = req.params.id;

    try {
        // Assuming 'pool' is your database connection pool
        const [result] = await pool.query('DELETE FROM Ranks WHERE id = ?', [rank_id]);

        // Check if any row was affected (optional but good for validation)
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Ranking deleted successfully' });
        } else {
            res.status(404).json({ message: 'Ranking not found' });
        }
    } catch (error) {
        console.error('Error deleting ranking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateRanking = async (req, res) => {
    const rank_id = req.params.id;
    const { ranking } = req.body; // Assuming req.body contains the updated ranking data

    try {
        // Assuming 'pool' is your database connection pool
        const [result] = await pool.query('UPDATE Ranks SET ranking = ? WHERE id = ?', [ranking, rank_id]);

        // Check if any row was affected (optional but good for validation)
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Ranking updated successfully' });
        } else {
            res.status(404).json({ message: 'Ranking not found' });
        }
    } catch (error) {
        console.error('Error updating ranking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserRanksWithDetailsService = async (userId) => {
    try {
        // Fetch user ranks from database
        const [ranks] = await pool.query('SELECT id, tmdb_id, ranking FROM Ranks WHERE user_id = ?', [userId]);

        // Array to store promises of movie detail requests
        const movieDetailPromises = ranks.map(async (rank) => {
            try {
                // Fetch movie details for each tmdb_id
                const movieDetails = await getMovieDetails(rank.tmdb_id);
                return {
                    ...rank,
                    movieDetails // Add movie details to the rank object
                };
            } catch (error) {
                console.error(`Failed to fetch details for movie with tmdb_id ${rank.tmdb_id}:`, error);
                return {
                    ...rank,
                    movieDetails: null // Handle error by setting movieDetails to null or handle accordingly
                };
            }
        });

        // Wait for all movie detail requests to complete
        const ranksWithDetails = await Promise.all(movieDetailPromises);
        return ranksWithDetails;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Failed to get ranks with movie details');
    }
};

export const methods = {
    testConnection,
    getMovieDetails,
    getPopularMovies,
    postUserRanked,
    getUserRanksWithDetails,
    deleteRanking,
    updateRanking
};
