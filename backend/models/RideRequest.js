import mongoose from "mongoose";

const rideRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ride_offer: { type: mongoose.Schema.Types.ObjectId, ref: "RideOffer", required: true },
  from_location: { type: String, required: true },
  to_location: { type: String, required: true },
  date: { type: Date, required: true },
  num_people: { type: Number, default: 1 },
  notes: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
}, { timestamps: true });

const RideRequest = mongoose.model("RideRequest", rideRequestSchema);
export default RideRequest;
