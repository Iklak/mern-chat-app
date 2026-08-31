const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDb = require("./config/db");

const authRouter = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const app = express();

connectDb();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chat app backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
