import express from 'express';
import cors from 'cors';
import Movieroutes from './routes/movies.routes.js';
import axios from 'axios';
import session from 'express-session'; // Add session support
import passport from 'passport';
import bcrypt from 'bcryptjs'; // For hashing passwords
import { Strategy as LocalStrategy } from 'passport-local'; // Local strategy for username/password
import crypto from 'crypto';
import User from './models/user.js'


const app = express();

//middlewares 
app.use(cors()); // allows requests from anywhere 
app.use(express.json());

const secret = crypto.randomBytes(32).toString('hex');
// Session middleware (required for passport)
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', Movieroutes);


export const callHealthEndpoint = async (port) => {
    try {
        const response = await axios.get(`http://localhost:${port}/api/health`);
        console.log('Database status:', response.data.status);
    } catch (error) {
        console.error('Error calling health endpoint:', error);
    }
};

// Configure Passport local strategy
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findByUsername(username);

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize user (store user id in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user from session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Example protected route
app.get('/api/protected', (req, res, next) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // User is authenticated, return data
        res.json({ message: 'You are authenticated!' });
    } else {
        // User is not authenticated, return 401 Unauthorized
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.use((req, res)=>{
    res.status(404).json({
        mesagge: 'not found'
    })
});

export default app;