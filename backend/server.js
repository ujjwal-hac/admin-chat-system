const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MODELS
const User = mongoose.model("User", {
  username: String,
  password: String,
  role: String
});

const Message = mongoose.model("Message", {
  sender: String,
  receiver: String,
  message: String,
  seen: Boolean
});

// CONNECT DB
mongoose.connect("mongodb+srv://chattingwithujjwal:ujjwal123@cluster0.aduvqnh.mongodb.net/chatDB?retryWrites=true&w=majority")
.then(async () => {
  console.log("MongoDB Connected ✅");

  // create admin
  const admin = await User.findOne({ username: "admin" });
  if (!admin) {
    await User.create({
      username: "admin",
      password: "123",
      role: "admin"
    });
  }

  // create user1
  const user1 = await User.findOne({ username: "user1" });
  if (!user1) {
    await User.create({
      username: "user1",
      password: "123",
      role: "user"
    });
  }

  console.log("Users ready ✅");
});

// ROUTES

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.json(user);
});

// GET USERS (ADMIN PANEL)
app.get("/users", async (req, res) => {
  const users = await User.find({ role: "user" });
  res.json(users);
});

// SEND MESSAGE
app.post("/send", async (req, res) => {
  await Message.create({
    ...req.body,
    seen: false
  });
  res.send("sent");
});

// GET MESSAGES
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  });

  res.json(messages);
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Running on " + PORT);
});
