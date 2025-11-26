// src/pages/RideDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function RideDetailsPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactsVisible, setContactsVisible] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const { data } = await axios.get(`/api/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRide(data);
      } catch (error) {
        console.error("Error fetching ride:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [rideId]);

  const handleAccept = async (requestId) => {
    await axios.put(
      `/api/rides/${rideId}/accept/${requestId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.reload();
  };

  const handleReject = async (requestId) => {
    await axios.put(
      `/api/rides/${rideId}/reject/${requestId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.reload();
  };

  const markCompleted = async () => {
    await axios.put(
      `/api/rides/${rideId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate("/my-rides");
  };

  const showContacts = async () => {
    const { data } = await axios.get(`/api/rides/${rideId}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setContactsVisible(data);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!ride) return <p className="text-center mt-10">Ride not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        Ride Details: {ride.from_location} → {ride.to_location}
      </h2>
      <p><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {ride.time}</p>
      <p><strong>Available Seats:</strong> {ride.available_seats}</p>
      <p><strong>Cost Share:</strong> ₹{ride.cost_share || "N/A"}</p>
      <p><strong>Status:</strong> {ride.status}</p>

      <h3 className="text-xl mt-6 mb-3 font-semibold">Pending Requests</h3>
      {ride.pendingRequests?.length ? (
        ride.pendingRequests.map((req) => (
          <div
            key={req._id}
            className="border p-3 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <p><strong>{req.requester.name}</strong></p>
              <p>{req.requester.email}</p>
              <p>Status: {req.status}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleAccept(req._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending requests.</p>
      )}

      <h3 className="text-xl mt-6 mb-3 font-semibold">Accepted Requests</h3>
      {ride.acceptedRequests?.length ? (
        ride.acceptedRequests.map((req) => (
          <div
            key={req._id}
            className="border p-3 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <p><strong>{req.requester.name}</strong></p>
              <p>{req.requester.email}</p>
              <p>Status: {req.status}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No accepted requests yet.</p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={markCompleted}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Mark as Completed
        </button>

        <button
          onClick={showContacts}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          View Contacts
        </button>
      </div>

      {contactsVisible && (
        <div className="mt-5 p-4 bg-gray-100 rounded">
          <h4 className="font-semibold mb-2">Contact Details</h4>
          <p><strong>Owner:</strong> {contactsVisible.owner.name} ({contactsVisible.owner.email})</p>
          {contactsVisible.accepted.map((u) => (
            <p key={u._id}><strong>Passenger:</strong> {u.name} ({u.email})</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default RideDetailsPage;
