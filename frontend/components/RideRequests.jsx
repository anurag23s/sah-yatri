import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const RideRequests = ({ rideId }) => {
  const [ride, setRide] = useState(null);

  const fetchRideDetails = async () => {
    const { data } = await axios.get(`/rides/${rideId}`);
    setRide(data);
  };

  const handleAccept = async (requestId) => {
    await axios.put(`/rides/${rideId}/accept/${requestId}`);
    fetchRideDetails();
  };

  const handleReject = async (requestId) => {
    await axios.put(`/rides/${rideId}/reject/${requestId}`);
    fetchRideDetails();
  };

  useEffect(() => {
    fetchRideDetails();
  }, [rideId]);

  if (!ride) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Ride Requests</h2>
      {ride.pendingRequests.length === 0 && <p>No pending requests.</p>}
      {ride.pendingRequests.map((req) => (
        <div key={req._id} className="border rounded p-3 mb-3">
          <p><strong>Requester:</strong> {req.requester?.name}</p>
          <p><strong>Seats:</strong> {req.num_people}</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => handleAccept(req._id)} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
            <button onClick={() => handleReject(req._id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RideRequests;
