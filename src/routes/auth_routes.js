const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post("/register", authController.postRegister);

// POST /api/auth/login
router.post("/login",authController.postLogin);

// POST /api/auth/logout
router.post("/logout", authController.postLogout);

// GET /api/auth/me
router.get("/me",authController.getMe);

// POST /auth/password/forgot
router.post("/password/forgot", authController.postForgot);

// POST /auth/password/reset
router.post("/password/reset", authController.postReset);

module.exports = router;
