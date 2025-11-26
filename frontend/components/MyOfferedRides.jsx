import React, { useEffect, useState } from "react";
import axios from "../src/api/axiosInstance";

const MyOfferedRides = () => {
  const [rides, setRides] = useState([]);

  const fetchRides = async () => {
    const { data } = await axios.get("/rides/my");
    setRides(data);
  };

  const markCompleted = async (id) => {
    await axios.put(`/rides/${id}/complete`);
    fetchRides();
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Offered Rides</h2>
      {rides.length === 0 && <p>No rides offered yet.</p>}
      {rides.map((ride) => (
        <div key={ride._id} className="border rounded p-3 mb-3 bg-gray-50">
          <p><strong>From:</strong> {ride.from_location}</p>
          <p><strong>To:</strong> {ride.to_location}</p>
          <p><strong>Date:</strong> {ride.date.split("T")[0]}</p>
          <p><strong>Seats:</strong> {ride.available_seats}</p>
          <p><strong>Status:</strong> {ride.status}</p>
          {ride.status === "active" && (
            <button
              onClick={() => markCompleted(ride._id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Mark as Completed
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOfferedRides;
