import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import generateToken from "../utils/generateToken.js";

console.log("JWT_SECRET:", process.env.JWT_SECRET);
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

// 🟢 Complete Profile Controller
export const completeProfile = async (req, res) => {
  try {
    const user = req.user; // from protect middleware
    const { name, bio, profession, mobile, hometown, skip } = req.body;

    // If user clicks "Skip"
    if (skip) {
      const token = generateToken(user._id);
      return res.json({ token, message: "Profile skipped successfully" });
    }

    // Normal profile completion
    if (!name) {
      return res.status(400).json({ message: "Name is required to complete profile" });
    }

    user.name = name;
    if (bio) user.bio = bio;
    if (profession) user.profession = profession;
    if (mobile) user.mobile = mobile;
    if (hometown) user.hometown = hometown;
    if (req.file) user.photo_url = req.file.path;

    await user.save();

    const token = generateToken(user._id);
    res.json({ token, message: "Profile completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🟡 Forgot Password
// 🟡 Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET; // read at runtime
    const FRONTEND_URL = process.env.FRONTEND_URL;

    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in env");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate password reset token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"SahaYaatra Support" <${process.env.SMTP_USER}>`, // custom sender name
      to: email,
      subject: "Password Reset - SahaYaatra",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>We received a request to reset your password for your SahaYaatra account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" 
             style="display:inline-block; padding:10px 20px; color:white; background-color:#007bff; border-radius:5px; text-decoration:none;">
             Reset Password
          </a>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <p>Regards,<br/>SahaYaatra Team</p>
        </div>
      `,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// 🟢 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const JWT_SECRET = process.env.JWT_SECRET; // read at runtime
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in env");

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    //const hashed = await bcrypt.hash(password, 10);
    user.password = password;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Invalid or expired token" });
  }
};

