import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import {notFound, errorHandler} from './middleware/errorMiddleware.js';
import logger from './middleware/loggerMiddleware.js';
import cookieParser from 'cookie-parser';
import uploadRoutes from './routes/uploadRoutes.js';

import colors from 'colors';

connectDB();

const app = express();
app.use(express.json()); // Body parser middleware. For express.js to understand req.body in your controllers
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // allows us to access req.cookie. In this case, we will be able to access req.cookie.jwt (the name of our cookie).

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res)=> res.send({clientId: process.env.PAYPAL_CLIENT_ID}));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);
app.use(logger);
app.listen(port, ()=> console.log(`Server running on port: ${port}`.cyan.inverse));