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

const getUserDetails = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users');
        console.log(rows)
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
    }
};
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
    const user_id = req.params.id; // This should be dynamically retrieved, e.g., from the authenticated user

    try {
        // Fetch user ranks from database
        const [ranks] = await pool.query('SELECT tmdb_id, ranking FROM ranks WHERE user_id = ?', [user_id]);

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

        // Send the combined data back to the client
        res.status(200).json({ status: 'success', data: ranksWithDetails });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to get ranks with movie details' });
    }
};



export const methods = {
    testConnection,
    getMovieDetails,
    getPopularMovies,
    getUserDetails,
    postUserRanked,
    getUserRanksWithDetails
};