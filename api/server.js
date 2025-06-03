// const express = require("express");
import express, { json } from "express";
const app = express();
const PORT = 3000;

/**
 * Librairies et middlewares
 */
import cors from "cors";
app.use(cors({
    origin: ['https://amelieroussin.ca', 'https://www.amelieroussin.ca']
}));

// old
// app.use(express.json());
// video andre diff
app.use(json());

// old
//const negotiate = require('./middlewares/negotiate');
//app.use(negotiate);

//const validateToken = require('./middlewares/authGuard.js');
//app.use(validateToken);

// video andre diff
import negociate from './middlewares/negotiate.js';
app.use(negociate);

import { validateToken } from './middlewares/authGuard.js';

/**
 * Routers
*/
// old
// const postRoute = require('./routers/postRoutes');
// app.use('/posts', validateToken, postRoute);
// 
// const userRoute = require('./routers/userRoutes');
// app.use('/users', validateToken, userRoute);
// 
// const authRoute = require('./routers/authRoutes');
// app.use('/', authRoute);

// video andre diff
import postRoute from './routers/postRoutes.js';
app.use('/posts', validateToken, postRoute);

import userRoute from './routers/userRoutes.js';
app.use('/users', validateToken, userRoute);

import authRoute from './routers/authRoutes.js';
app.use('/', authRoute);

/**
 * Serveur HTTP
 */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
