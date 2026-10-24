require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ---------- Models ----------
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
}));

const Note = mongoose.model("Note", new mongoose.Schema({
  title: String,
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true }));

// ---------- Auth middleware ----------
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ---------- Auth routes ----------
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });
    res.status(201).json({ message: "Signup successful" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, name: user.name });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ---------- Notes CRUD (protected) ----------
app.get("/api/notes", auth, async (req, res) =>
  res.json(await Note.find({ user: req.userId }).sort({ createdAt: -1 })));

app.post("/api/notes", auth, async (req, res) =>
  res.status(201).json(await Note.create({ ...req.body, user: req.userId })));

app.put("/api/notes/:id", auth, async (req, res) =>
  res.json(await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId }, req.body, { new: true })));

app.delete("/api/notes/:id", auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted" });
});

app.listen(process.env.PORT, () => console.log("Server on " + process.env.PORT));