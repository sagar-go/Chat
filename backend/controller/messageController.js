const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    return res.send(messages);
  } catch (error) {
    return res.status(400).send("ERRRRRRRROR");
  }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).send("Invalid data passed into request");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    return res.send(message);
  } catch (error) {
    return res.status(400).send("ERROR");
  }
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.body;

  // if (!content || !chatId) {
  //   console.log("Invalid data passed into request");
  //   return res.status(400).send("Invalid data passed into request");
  // }

  // var newMessage = {
  //   sender: req.user._id,
  //   content: content,
  //   chat: chatId,
  // };

  try {
    let message = await Message.findByIdAndDelete(messageId);
    // console.log(message, "MMEEEESSAGE");
    // let newMessages = await Message.find();
    return res.send({ success: true, data: message });
  } catch (error) {
    return res.status(400).send("ERROR");
  }
};

module.exports = { allMessages, sendMessage, deleteMessage };
