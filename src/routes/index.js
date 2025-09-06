const express = require("express");
const router = express.Router();

// const authRoutes = require("./auth_routes");
// const usersRoutes = require("./user_routes");
const tasksRoutes = require("./task_routes");

// router.use("/auth", authRoutes);
// router.use("/users", usersRoutes);
router.use("/tasks", tasksRoutes);

module.exports = router;