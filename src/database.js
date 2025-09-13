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

// Импорт моделей
const User = require('../models/user')(sequelize, require('sequelize').DataTypes);
const Task = require('../models/task')(sequelize, require('sequelize').DataTypes);

// Определение ассоциаций
User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks'
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Экспорт моделей и экземпляра Sequelize
module.exports = {
    sequelize,
    User,
    Task
};

// Функция для синхронизации базы данных
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Синхронизация моделей с базой данных
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports.syncDatabase = syncDatabase;
