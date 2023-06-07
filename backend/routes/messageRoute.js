const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteMessage,
} = require("../controller/messageController");
const { protect } = require("../utils/util");

const router = express.Router();

router.route("/fetchMessage/:chatId").get(protect, allMessages);
router.route("/sendMessage").post(protect, sendMessage);
router.route("/deleteMessage").post(protect, deleteMessage);

module.exports = router;
