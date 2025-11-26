import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google users
  googleId: { type: String }, // will exist if user signs up via Google
  bio: { type: String },
  profession: { type: String },
  hometown: { type: String },
  contact_verified: { type: Boolean, default: false },
  trust_score: { type: Number, default: 0 },
  photo_url: { type: String },
}, { timestamps: true });

// Password hashing before save (only if password exists)
userSchema.pre("save", async function(next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password verification method
userSchema.methods.matchPassword = async function(password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
