
const { Sequelize } = require('sequelize');
const path = require('path');

// Попробуем взять конфиг из переменных окружения, иначе — из config/config.json
let dbName = process.env.DB_NAME;
let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;
let dbHost = process.env.DB_HOST;
let dbPort = process.env.DB_PORT;
let dbDialect = process.env.DB_DIALECT || 'mysql';

if (!dbName || !dbUser) {
    try {
        const cfg = require(path.join(__dirname, 'config.json'))[process.env.NODE_ENV || 'development'];
        dbName = dbName || cfg.database;
        dbUser = dbUser || cfg.username;
        dbPassword = dbPassword || cfg.password;
        dbHost = dbHost || cfg.host;
        dbPort = dbPort || cfg.port;
        dbDialect = cfg.dialect || dbDialect;
    } catch (err) {
        // если config.json недоступен, оставляем переменные окружения (возможно undefined)
        console.warn('config/config.json not found or invalid, using env variables only');
    }
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect,
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

module.exports = sequelize;
