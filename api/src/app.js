import express from 'express';
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Movieroutes from './routes/movies.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// CORS configuration
const allowedOrigins = ['http://127.0.0.1:5500'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// JSON middleware
app.use(express.json());

// Secret key for JWT
const jwtSecret = 'your_jwt_secret';

// Example protected route
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You are authenticated!' });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

app.use('/api', Movieroutes);
app.use('/auth', userRoutes);

// Health endpoint
export const callHealthEndpoint = async (port) => {
    try {
        const response = await axios.get(`http://localhost:${port}/api/health`);
        console.log('Database status:', response.data.status);
    } catch (error) {
        console.error('Error calling health endpoint:', error);
    }
};

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Not found'
    });
});

export default app;
