// Francis Tardif et Amélie Roussin

const express = require("express");
const app = express();
const PORT = 3000;

const cors = require("cors");
app.use(cors({
    origin: ['https://amelieroussin.ca', 'https://www.amelieroussin.ca']
}));

app.use(express.json());

const negotiate = require('./middlewares/negotiate');
app.use(negotiate);

const authGuard = require('./middlewares/authGuard');


const postRoute = require('./routers/postRoutes');
app.use('/posts', postRoute);

const userRoute = require('./routers/userRoutes');
app.use('/users', authGuard.validateToken, userRoute);

const loginRoute = require('./routers/loginRoutes');
app.use('/', loginRoute);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});