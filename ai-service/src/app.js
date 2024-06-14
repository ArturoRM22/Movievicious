import express from 'express';
import cors from 'cors';
import AIroutes from './routes/ai.routes.js';

const app = express();

// Middlewares to handle CORS and JSON
app.use(cors());
app.use(express.json());

// Main route
app.use('/AI', AIroutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Not found'
    });
});

export default app;
