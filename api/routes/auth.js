const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', (req, res, next) => {
    console.log('=== REGISTER ROUTE HIT ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Original URL:', req.originalUrl);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    next();
}, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);

router.post('/password/forgot', authController.passwordForgot);
router.post('/password/reset', authController.passwordReset);

module.exports = router;
