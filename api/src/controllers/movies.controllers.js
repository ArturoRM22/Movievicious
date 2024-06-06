import {pool} from '../db_connection.js';


const testConnection = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1');
        res.status(200).json({ status: 'healthy' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
};

export const methods = {
    testConnection
};