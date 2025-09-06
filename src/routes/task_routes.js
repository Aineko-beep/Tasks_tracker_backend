const express = require("express");
const router = express.Router();

// GET /api/tasks
router.get("/", (req, res) => {
    res.json([{ id: 1, title: "Mock Task", status: "new" }]);
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
    res.json({ id: req.params.id, title: "Mock Task", status: "done" });
});

// POST /api/tasks
router.post("/", (req, res) => {
    res.json({ message: "Task created (mock)" });
});

// PUT /api/tasks/:id
router.put("/:id", (req, res) => {
    res.json({ message: "Task updated (mock)" });
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
    res.json({ message: "Task deleted (mock)" });
});

module.exports = router;
