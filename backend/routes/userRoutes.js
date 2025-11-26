import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import protect from "../middleware/auth.js";
import multer from "multer";
import { completeProfile, forgotPassword, resetPassword } from "../controller/userController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" }); // temporary storage, can be replaced with cloud storage later

// 🟢 Complete profile (protected)
router.put("/complete-profile", protect, upload.single("photo"), completeProfile);



// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 🟡 Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// 🟢 Register User
router.post("/register", async (req, res) => {
  const { name, email, password, age, gender, bio, hometown } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password, age, gender, bio, hometown });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// 🟢 Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// 🟢 Get Profile (protected)
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

export default router;
