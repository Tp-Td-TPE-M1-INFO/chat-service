const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/message.controller");

const router = express.Router();

router.route("/:chatId").get(allMessages);
router.route("/send/:id").post(sendMessage);

module.exports = router;
