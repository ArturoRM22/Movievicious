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



export const methods = {
    testConnection,
    getMovieDetails,
    getPopularMovies
};