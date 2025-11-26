import express from "express";
import CabGroup from "../models/CabGroup.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// @route POST /api/cabgroups
router.post("/", protect, async (req, res) => {
  const group = new CabGroup({
    created_by: req.user._id,
    members: [req.user._id],
    ...req.body,
  });
  const createdGroup = await group.save();
  res.status(201).json(createdGroup);
});

// @route GET /api/cabgroups
router.get("/", async (req, res) => {
  const groups = await CabGroup.find()
    .populate("members", "name bio contact_verified created_by");
  res.json(groups);
});

// @route POST /api/cabgroups/:id/join
router.post("/:id/join", protect, async (req, res) => {
  const group = await CabGroup.findById(req.params.id);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (!group.members.includes(req.user._id)) {
    group.members.push(req.user._id);
  }

  // Update status if full
  if (group.members.length >= group.required_people) group.status = "Full";

  await group.save();
  res.json(group);
});

export default router;
