const { Sequelize } = require('sequelize');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

let dbName = process.env.DB_NAME;
let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;
let dbHost = process.env.DB_HOST;
let dbPort = process.env.DB_PORT;
let dbDialect = process.env.DB_DIALECT || 'mysql';

if (!dbName || !dbUser) {
    try {
        const cfgPath = path.join(__dirname, 'config.json');
        const cfg = require(cfgPath)[env];
        dbName = dbName || cfg.database;
        dbUser = dbUser || cfg.username;
        dbPassword = dbPassword || cfg.password;
        dbHost = dbHost || cfg.host;
        dbPort = dbPort || cfg.port;
        dbDialect = cfg.dialect || dbDialect;
    } catch (error) {
        console.warn('db/config.json not found or invalid, using env variables only');
    }
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect,
});

module.exports = sequelize;

