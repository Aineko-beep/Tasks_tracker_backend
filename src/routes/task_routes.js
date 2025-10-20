const express = require("express");
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/tasks
router.get("/", taskController.getTask);

// GET /api/tasks/:id
router.get("/:id", taskController.getTaskId);

// POST /api/tasks
router.post("/",  taskController.postTask);

// PATCH /api/tasks/:id
router.patch("/:id",  taskController.patchTaskId);

// DELETE /api/tasks/:id
router.delete("/:id", taskController.deleteTaskId);

module.exports = router;
