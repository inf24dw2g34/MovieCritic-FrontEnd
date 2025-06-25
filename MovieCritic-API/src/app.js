require('dotenv').config();
const port = process.env.PORT || 3000;

const express = require('express');
const session = require('express-session');
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");
const passport = require('./config/passport');
const db = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();
const cors = require('cors');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({ db: db.sequelize, tableName: 'sessions' }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(morgan('dev'));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/reviews', require('./routes/reviews'));
app.use('/movies', require('./routes/movies'));
app.use('/directors', require('./routes/directors'));
app.use('/users', require('./routes/users'));

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the MovieCritic APIi!",
        documentation: "/docs",
        endpoints: {
            auth: "/auth/google",
            reviews: "/reviews",
            movies: "/movies",
            directors: "/directors",
            users: "/users"
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

db.sequelize.sync(
    //    {force: (process.env.NODE_ENV === 'development')}
    ).then(() => {
    console.log('\nDatabase synced successfully.');
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
