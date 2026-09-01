const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/message.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:conversationId", authMiddleware, getMessages);

module.exports = router;
