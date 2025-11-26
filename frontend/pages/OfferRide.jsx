import { useState } from "react";
import API from "../services/api.js";

function OfferRide() {
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    date: "",
    time: "",
    available_seats: 1,
    cost_share: 0,
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/rides", formData);
      alert("Ride offered successfully!");
      setFormData({
        from_location: "",
        to_location: "",
        date: "",
        time: "",
        available_seats: 1,
        cost_share: 0,
        notes: "",
      });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Offer a Ride</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="from_location"
          placeholder="From"
          value={formData.from_location}
          onChange={handleChange}
          required
        />
        <input
          name="to_location"
          placeholder="To"
          value={formData.to_location}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          name="available_seats"
          type="number"
          min="1"
          value={formData.available_seats}
          onChange={handleChange}
          required
        />
        <input
          name="cost_share"
          type="number"
          min="0"
          value={formData.cost_share}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={handleChange}
        />
        <button type="submit">Offer Ride</button>
      </form>
    </div>
  );
}

export default OfferRide;
