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

const getMovieDetails = async (req, res) => {
    const movieId = req.params.id;

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
        res.status(200).json(response.data);
    } catch (error) {
        console.error('TMDB API request error:', error);
        res.status(500).json({ error: error.message });
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

export const methods = {
    testConnection,
    getMovieDetails,
    getPopularMovies,
    getUserDetails,
    postUserRanked
};