import mongoose from "mongoose";

const cabGroupSchema = new mongoose.Schema({
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  from_location: { type: String, required: true },
  to_location: { type: String, required: true },
  date: { type: Date, required: true },
  required_people: { type: Number, default: 4 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["Open", "Full", "Closed"], default: "Open" },
}, { timestamps: true });

const CabGroup = mongoose.model("CabGroup", cabGroupSchema);
export default CabGroup;
