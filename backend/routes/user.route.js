const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { getUsers, getUserById } = require("../controllers/user.controller");
const router = express.Router();
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
module.exports = router;
