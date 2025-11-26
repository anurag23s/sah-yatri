import express from "express";
import { googleAuth } from "../controller/authController.js";

const router = express.Router();

// Google OAuth
router.post("/google", googleAuth);

export default router;
