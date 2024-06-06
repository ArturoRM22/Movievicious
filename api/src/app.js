import express from 'express';
import cors from 'cors';
import Movieroutes from './routes/movies.routes.js';
import axios from 'axios';


const app = express();

//middlewares 
app.use(cors()); // allows requests from anywhere 
app.use(express.json());

app.use('/api',Movieroutes);

/* app.get('/api',(req, res) =>{
  res.send("Hola");
}) */

export const callHealthEndpoint = async (port) => {
    try {
        const response = await axios.get(`http://localhost:${port}/api/health`);
        console.log('Health check response:', response.data);
    } catch (error) {
        console.error('Error calling health endpoint:', error);
    }
};


app.use((req, res)=>{
    res.status(404).json({
        mesagge: 'not found'
    })
});

export default app;