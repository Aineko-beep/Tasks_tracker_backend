const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.APP_PORT;
const host = process.env.APP_HOST;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Привет Мир' });
});

app.post('/user', (req, res) => {
    res.status(200).json({ message: 'Пользователь создан' });
})

app.listen(port, host, () => {
    console.log('Сервер начал работу на порту 80');
});