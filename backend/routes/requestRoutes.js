import express from "express";
import RideRequest from "../models/RideRequest.js";
import RideOffer from "../models/RideOffer.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// ✅ Create a new ride request (for a specific offer)
router.post("/", protect, async (req, res) => {
  try {
    const { ride_offer, from_location, to_location, date, num_people, notes } = req.body;

    const ride = await RideOffer.findById(ride_offer);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    const request = new RideRequest({
      requester: req.user._id,
      ride_offer,
      from_location,
      to_location,
      date,
      num_people,
      notes,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error: error.message });
  }
});

// ✅ Get all requests received for rides owned by the logged-in user
router.get("/received", protect, async (req, res) => {
  try {
    const rides = await RideOffer.find({ owner: req.user._id });
    const rideIds = rides.map(r => r._id);

    const requests = await RideRequest.find({ ride_offer: { $in: rideIds } })
      .populate("requester", "name email bio")
      .populate("ride_offer", "from_location to_location date time");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching received requests", error: error.message });
  }
});

// ✅ Accept a ride request
router.put("/:id/accept", protect, async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id).populate("ride_offer");
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Ensure only the ride owner can accept
    if (request.ride_offer.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "Accepted";
    ride.available_seats -= request.num_people || 1;
    if (ride.available_seats < 0) ride.available_seats = 0;

    await request.save();

    res.json({ message: "Request accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error: error.message });
  }
});

// ✅ Reject a ride request
router.put("/:id/reject", protect, async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id).populate("ride_offer");
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Ensure only the ride owner can reject
    if (request.ride_offer.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "Rejected";
    await request.save();

    res.json({ message: "Request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting request", error: error.message });
  }
});

// ✅ Get all requests made by the logged-in user
router.get("/sent", protect, async (req, res) => {
  try {
    const requests = await RideRequest.find({ requester: req.user._id })
      .populate("ride_offer", "from_location to_location date time owner")
      .populate("ride_offer.owner", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sent requests", error: error.message });
  }
});

export default router;
