import express from "express";
import RideOffer from "../models/RideOffer.js";
import protect from "../middleware/auth.js";
import RideRequest from "../models/RideRequest.js";


const router = express.Router();

// @route POST /api/rides
router.post("/", protect, async (req, res) => {
  const ride = new RideOffer({
    owner: req.user._id,
    ...req.body,
  });
  const createdRide = await ride.save();
  res.status(201).json(createdRide);
});

// @route GET /api/rides
router.get("/", async (req, res) => {
  const rides = await RideOffer.find().populate("owner", "name bio contact_verified");
  res.json(rides);
});

// @route GET /api/rides/my
router.get("/my", protect, async (req, res) => {
  const rides = await RideOffer.find({ owner: req.user._id })
    .populate({
      path: "pendingRequests",
      populate: { path: "requester", select: "name email" },
    })
    .populate({
      path: "acceptedRequests",
      populate: { path: "requester", select: "name email" },
    });

  res.json(rides);
});

// @route PUT /api/rides/:rideId/accept/:requestId
router.put("/:rideId/accept/:requestId", protect, async (req, res) => {
  const { rideId, requestId } = req.params;

  const ride = await RideOffer.findById(rideId);
  if (!ride || ride.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized or ride not found" });
  }

  const request = await RideRequest.findById(requestId);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "accepted";
  await request.save();

  ride.acceptedRequests.push(request._id);
  ride.pendingRequests = ride.pendingRequests.filter(
    (id) => id.toString() !== requestId
  );
  await ride.save();

  res.json({ message: "Request accepted", request });
});

// @route PUT /api/rides/:rideId/reject/:requestId
router.put("/:rideId/reject/:requestId", protect, async (req, res) => {
  const { rideId, requestId } = req.params;

  const ride = await RideOffer.findById(rideId);
  if (!ride || ride.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized or ride not found" });
  }

  const request = await RideRequest.findById(requestId);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "rejected";
  await request.save();

  ride.pendingRequests = ride.pendingRequests.filter(
    (id) => id.toString() !== requestId
  );
  await ride.save();

  res.json({ message: "Request rejected", request });
});

// @route PUT /api/rides/:rideId/complete
router.put("/:rideId/complete", protect, async (req, res) => {
  const { rideId } = req.params;

  const ride = await RideOffer.findById(rideId);
  if (!ride || ride.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized or ride not found" });
  }

  ride.status = "completed";
  await ride.save();

  res.json({ message: "Ride marked as completed" });
});

// @route GET /api/rides/:rideId/contacts
router.get("/:rideId/contacts", protect, async (req, res) => {
  const { rideId } = req.params;

  const ride = await RideOffer.findById(rideId)
    .populate("owner", "name email")
    .populate({
      path: "acceptedRequests",
      populate: { path: "requester", select: "name email" },
    });

  const userId = req.user._id.toString();

  const isAllowed =
    ride.owner._id.toString() === userId ||
    ride.acceptedRequests.some(
      (r) => r.requester._id.toString() === userId
    );

  if (!isAllowed)
    return res.status(403).json({ message: "Access denied" });

  res.json({
    owner: ride.owner,
    accepted: ride.acceptedRequests.map((r) => r.requester),
  });
});


export default router;
