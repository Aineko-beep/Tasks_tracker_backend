
require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db.config');
const app = express();
const PORT = process.env.PORT || 3000;

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

