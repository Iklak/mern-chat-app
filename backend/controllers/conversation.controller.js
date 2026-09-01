const Conversation = require("../models/Coversation");

const createConversation = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "receiverId is required",
      });
    }
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "you cannot create conversation with yourself",
      });
    }

    const existingConversation = await Conversation.findOne({
      members: {
        $all: [senderId, receiverId],
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Converstion already exists",
        data: existingConversation,
      });
    }
    const conversation = await Conversation.create({
      members: [senderId, receiverId],
    });

    res.status(200).json({
      success: true,
      message: "Conversation created successfully",
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createConversation,
};
