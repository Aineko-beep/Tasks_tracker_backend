
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./src/routes');
const sequelize = require('./config/db.config');
const app = express();
const PORT = process.env.PORT || 5000;

// Note: development debug middleware removed for production-like cleanliness

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API routes
app.use('/api', routes);

// Debug endpoints removed

// Global error handler to catch JSON parse errors and others
app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err && err.message, err);
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    res.status(500).json({ error: 'Internal server error' });
});

const initDatabase = async () => {
    try {
        // Проверяем подключение
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Синхронизируем модели
        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully.');

        // Запускаем сервер
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

initDatabase();

