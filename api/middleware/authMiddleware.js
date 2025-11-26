const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Неавторизованный доступ' });
    }
};