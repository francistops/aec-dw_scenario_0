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

const negotiate = require('./middlewares/negotiate');
app.use(negotiate);

const authGuard = require('./middlewares/authGuard');

/**
 * Routers
 * Ces 2 lignes pour chaque table qu'on ajoute
 */
const postRoute = require('./routers/postRoutes');
app.use('/posts', authGuard.validateToken, postRoute);

const userRoute = require('./routers/userRoutes');
app.use('/users', authGuard.validateToken, userRoute);

const loginRoute = require('./routers/loginRoutes');
app.use('/', loginRoute);

// const subscribeRoute = require('./routers/userRoutes')
// app.use('/subscribe', subscribeRoute)

/**
 * Serveur HTTP
 */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// const postRoute = require('./routers/postRoutes');
// app.use('/posts', validateToken, postRoute);
// 
// const userRoute = require('./routers/userRoutes');
// app.use('/users', validateToken, userRoute);
// 
// const authRoute = require('./routers/authRoutes');
// app.use('/', authRoute);