const Message = require("../models/Message");
const Conversation = require("../models/Coversation");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({
        success: false,
        message: "conversation and text are required",
      });
    }
    // check conversation exist

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(400).json({
        success: false,
        message: "Conversation not found",
      });
    }
    // cheacking logged-in user belong to conversation

    const isMember = conversation.members.some(
      (member) => member.toString() === senderId.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        success: false,
        mesage: "you are not a member of this conversation",
      });
    }

    const message = await Message.create({
      conversationId,
      sender: senderId,
      text,
    });

    // update last message
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    // Check conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Check user belongs to conversation
    const isMember = conversation.members.some(
      (member) => member.toString() === userId.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this conversation",
      });
    }

    const messages = await Message.find({
      conversationId,
    })
      .populate("sender", "name email profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
