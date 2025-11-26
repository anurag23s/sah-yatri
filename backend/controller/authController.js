import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body; // frontend sends Google ID token
    if (!tokenId) return res.status(400).json({ message: "Google token missing" });

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Existing user → send final JWT
      const token = generateToken(user._id);
      return res.json({ token, message: "Login successful" });
    }

    // New user → create with minimal info
    user = new User({
      email,
      googleId,
      name,
      photo_url: picture,
    });

    await user.save();

    // Send temporary token for profile completion
    const tempToken = generateToken(user._id); // can distinguish temp vs final in frontend
    return res.json({
      tempToken,
      message: "New Google user created, please complete profile",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
