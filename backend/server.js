const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const Conversation = require("./models/Coversation");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDb = require("./config/db");

const authRouter = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const conversationRoutes = require("./routes/conversation.route");
const messageRoutes = require("./routes/message.route");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

connectDb();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chat app backend is running",
  });
});

// Socket.io

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    console.log("Token received:", !!token);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Authenticated user:", decoded.userId);

    socket.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("JWT ERROR NAME:", error.name);
    console.log("JWT ERROR MESSAGE:", error.message);

    next(new Error("Invalid or expired token"));
  }
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);

    console.log(`${socket.id} joined conversation ${conversationId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { conversationId, text } = data;
      const senderId = socket.userId;
      if (!conversationId || !text) {
        return;
      }
      const message = await Message.create({
        conversationId,
        sender: senderId,
        text,
      });
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
      });

      const populateMessage = await Message.findById(message._id).populate(
        "sender",
        "name email profileImage",
      );
      io.to(conversationId).emit("receiverMessage", populateMessage);
    } catch (error) {
      console.log("Socket message error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
