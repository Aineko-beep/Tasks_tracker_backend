const express = require("express");
const router = express.Router();

// const usersRoutes = require("./user_routes");
const authRoutes = require("./auth_routes");
const tasksRoutes = require("./task_routes");

// router.use("/users", usersRoutes);
router.use("/tasks", tasksRoutes);
router.use("/auth", authRoutes);

module.exports = router;