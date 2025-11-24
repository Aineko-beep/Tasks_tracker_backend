const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const taskRoutes = require('./tasks');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;

