const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');

// GET: /api/user
router.get("/", userController.getAllUsers);

//GET: /api/user/id
router.get("/:id", userController.getUserById)

//POST: /api/user
router.post("/", userController.postUserCreated)

//PATCH: /api/user/id
router.patch("/:id", userController.patchUserUpdated)

//DELETE: /api/user/id
router.delete("/:id", userController.deleteUser)

module.exports = router;