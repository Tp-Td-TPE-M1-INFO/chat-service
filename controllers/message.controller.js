const asyncHandler = require("express-async-handler");
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");

//@description     Get all Messages
//@route           GET /api/Message/:chatId

const allMessages = asyncHandler(async (req, res) => {
  try {
    let messages = await Message.find({ chat: req.params.chatId }).populate("chat");
     messages = await Message.populate(messages, {
      path: "chat.latestMessage"
    });
    res.status(200).json(messages);

  } catch (error) {
    res.status(400).json(error)
  }
});

//@description     Create New Message
//@route           POST /api/Message/send/:id

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.params.id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("chat")

    await Chat.findByIdAndUpdate(
      req.body.chatId, 
      { latestMessage: message },
      {new: true, upsert:true, setDefaultsOnInsert: true}
    );

    message = await message.chat.populate("latestMessage");
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = { allMessages, sendMessage };
