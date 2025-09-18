const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: env === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

// Инициализация моделей
const User = require('./user')(sequelize, require('sequelize').DataTypes);
const Task = require('./task')(sequelize, require('sequelize').DataTypes);

// Определение ассоциаций
User.associate({ User, Task });
Task.associate({ User, Task });

module.exports = {
  sequelize,
  User,
  Task
};