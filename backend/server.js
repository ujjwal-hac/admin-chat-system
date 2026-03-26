const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// ✅ Models
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

// ✅ MongoDB connection
mongoose.connect("mongodb+srv://chattingwithujjwal:ujjwal123@cluster0.aduvqnh.mongodb.net/chatDB?retryWrites=true&w=majority")
.then(async () => {
  console.log("MongoDB Connected ✅");

  // create default admin safely
  const existing = await User.findOne({ username: "admin" });

  if (!existing) {
    await User.create({
      username: "admin",
      password: "123",
      role: "admin"
    });
    console.log("Default admin created ✅");
  } else {
    console.log("Admin already exists");
  }

})
.catch(err => console.log("Mongo Error ❌", err));

// ✅ Routes

// test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// login
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);

  if (user) {
    res.json(user);
  } else {
    res.json(null);
  }
});

// send message
app.post("/send", async (req, res) => {
  await Message.create({
    ...req.body,
    seen: false
  });

  res.send("Message sent ✅");
});

// get messages between 2 users
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

// ✅ Start server (IMPORTANT for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
