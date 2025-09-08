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

// POST /api/auth/recovery
router.post("/recovery", (req, res) => {
    res.json({ message: "Password recovery" });
});

module.exports = router;
