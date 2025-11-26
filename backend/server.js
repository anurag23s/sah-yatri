import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import authRoutes from "./routes/authRoutes.js";



connectDB();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., "http://localhost:5173"
  credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/cabgroups", groupRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SahaYaatra backend is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
