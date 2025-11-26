import mongoose from "mongoose";

const rideOfferSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  from_location: { type: String, required: true },
  to_location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  available_seats: { type: Number, required: true },
  cost_share: { type: Number },
  notes: { type: String },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  acceptedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "RideRequest" }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "RideRequest" }],
}, { timestamps: true });

const RideOffer = mongoose.model("RideOffer", rideOfferSchema);
export default RideOffer;
