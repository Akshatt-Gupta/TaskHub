import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));
 
app.use(morgan('dev')); 


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Database connected successfully');
}).catch((err) => {
  console.error('Database connection error:', err);
});

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', async(req, res) => {
    res.status(200).json({
        message: 'Welcome to TaskHub API',
    });
});
//http://localhost:5000/api-v1/auth/register
//http://localhost:5000/api-v1/auth/login
app.use('/api-v1', routes); 

// Middleware for handling 404 errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
    });
});

//not found middleware
app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found',
    });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});