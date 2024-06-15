const express = require('express');
const cors = require('cors');
const AIroutes = require('./routes/ai.routes.js');

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

module.exports = app;