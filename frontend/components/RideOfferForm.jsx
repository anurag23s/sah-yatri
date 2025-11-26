import React, { useState } from "react";
import axios from "../api/axiosInstance";

const RideOfferForm = () => {
  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    date: "",
    time: "",
    available_seats: "",
    cost_share: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/rides/offer", form);
      alert("Ride offered successfully!");
      setForm({ from_location: "", to_location: "", date: "", time: "", available_seats: "", cost_share: "", notes: "" });
    } catch (err) {
      console.error(err);
      alert("Error creating ride offer");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Offer a Ride</h2>
      {["from_location", "to_location", "date", "time", "available_seats", "cost_share", "notes"].map((field) => (
        <div key={field} className="mb-3">
          <label className="block mb-1 capitalize">{field.replace("_", " ")}</label>
          <input
            type={field === "date" ? "date" : field === "time" ? "time" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            required={["from_location", "to_location", "date", "time", "available_seats"].includes(field)}
            className="w-full border p-2 rounded"
          />
        </div>
      ))}
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  );
};

export default RideOfferForm;
