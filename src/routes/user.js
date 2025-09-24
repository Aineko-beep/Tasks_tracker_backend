const express = require("express");
const router = express.Router();

 // GET: /api/user
router.get("/", (req, res) => {
    res.json([{ id: 1, title: "List of users", status: "new" }]);
});

//GET: /api/user/id
router.get("/:id", (req, res) => {
    res.json({ id: req.params.id, title: "List of users", status: "done" });
});

//POST: /api/user
router.post("/", (req, res) => {
    res.json({ message: "A user has been created" });
});

//PATCH: /api/user/id
router.put("/:id", (req, res) => {
    res.json({ message: "updated user" });
});

//DELETE: /api/user/id
router.delete("/:id", (req, res) => {
    res.json({ message: "the user has been deleted" });
});

module.exports = router;