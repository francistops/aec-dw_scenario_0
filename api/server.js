const express = require("express");
const app = express();
const PORT = 3000;

/**
 * Librairies et middlewares
 */
const cors = require("cors");
app.use(cors({
    origin: ['https://amelieroussin.ca', 'https://www.amelieroussin.ca']
}));

app.use(express.json());
// video andre diff
// app.use(json());


const negotiate = require('./middlewares/negotiate');
app.use(negotiate);

const validateToken = require('./middlewares/authGard.js');
app.use(validateToken);

// video andre diff
// import negociate from './middlewares/negotiate';
// app.use(negociate);
//
// import { validateToken } from './middlewares/authGard.js';

/**
 * Routers
 * Ces 2 lignes pour chaque table qu'on ajoute
 */
const postRoute = require('./routers/postRoutes');
app.use('/posts', validateToken, postRoute);

const userRoute = require('./routers/userRoutes');
app.use('/users', validateToken, userRoute);

const loginRoute = require('./routers/loginRoutes');
app.use('/', loginRoute);

/**
 * Serveur HTTP
 */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
