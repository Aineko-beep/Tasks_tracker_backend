const express = require("express");
const router = express.Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
    res.json({ message: "User is registered (mock)" });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
    res.json({ token: "mock-jwt-token" });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
    res.json({ message: "User is logged out (mock)" });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
    res.json({ message: "User information is valid (mock)" });
});

// POST /auth/password/forgot
router.post("/password/forgot", (req, res) => {
    res.json({ message: "Password recovery email sent (mock)" });
});
// POST /auth/password/reset
router.post("/password/reset", (req, res) => {
    res.json({ message: "Password reset (mock)" });
});

module.exports = router;
