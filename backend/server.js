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

// CONNECT
mongoose.connect("mongodb+srv://chattingwithujjwal:ujjwal123@cluster0.aduvqnh.mongodb.net/chatDB?retryWrites=true&w=majority")
.then(async () => {
  console.log("MongoDB Connected ✅");

  // 🔥 FORCE RESET USERS (IMPORTANT)
  await User.deleteMany({});

  await User.insertMany([
    { username: "admin", password: "myloveforcoding", role: "admin" },
    { username: "anuj_boss", password: "anujhere", role: "user" },
    { username: "sakshi", password: "19062008", role: "user" },
    { username: "Ayush_pant", password: "ayushhere", role: "user" }
  ]);

  console.log("Users reset ✅");
});

// ROUTES

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// LOGIN (SAFE CHECK)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) return res.json(null);

  res.json(user);
});

// USERS
app.get("/users", async (req, res) => {
  const users = await User.find({ role: "user" });
  res.json(users);
});

// SEND
app.post("/send", async (req, res) => {
  await Message.create({
    ...req.body,
    seen: false
  });
  res.send("sent");
});

// MESSAGES
app.get("/messages/:u1/:u2", async (req, res) => {
  const { u1, u2 } = req.params;

  const msgs = await Message.find({
    $or: [
      { sender: u1, receiver: u2 },
      { sender: u2, receiver: u1 }
    ]
  });

  res.json(msgs);
});

// START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
