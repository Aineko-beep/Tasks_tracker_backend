
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./api/router');
const sequelize = require('./db/db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Debug: log every incoming request early to see if it reaches the server
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err && err.message, err);
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    res.status(500).json({ error: 'Internal server error' });
});

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Register endpoint: POST http://localhost:${PORT}/api/auth/register`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

initDatabase();