const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://chattingwithujjwal:ujjwal123@cluster0.aduvqnh.mongodb.net/?appName=Cluster0");

// User Schema
const User = mongoose.model("User", {
  username: String,
  password: String,
  role: String
});

// Message Schema
const Message = mongoose.model("Message", {
  sender: String,
  receiver: String,
  message: String,
  seen: Boolean
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) res.json(user);
  else res.json(null);
});

// SEND MESSAGE
app.post("/send", async (req, res) => {
  await Message.create({ ...req.body, seen: false });
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

app.listen(3000, () => console.log("Server running"));
