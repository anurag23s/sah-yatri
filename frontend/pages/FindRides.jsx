import { useEffect, useState } from "react";
import API from "../services/api.js";

function RideCard({ ride }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
      <h4>{ride.from_location} → {ride.to_location}</h4>
      <p>Date: {new Date(ride.date).toLocaleDateString()} | Time: {ride.time}</p>
      <p>Seats Available: {ride.available_seats}</p>
      <p>Owner: {ride.owner.name} | Bio: {ride.owner.bio || "N/A"}</p>
      <p>Contact Verified: {ride.owner.contact_verified ? "Yes" : "No"}</p>
      <p>Notes: {ride.notes || "N/A"}</p>
    </div>
  );
}

function FindRides() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      const { data } = await API.get("/rides");
      setRides(data);
    };
    fetchRides();
  }, []);

  return (
    <div>
      <h2>Available Rides</h2>
      {rides.length === 0 ? <p>No rides available</p> : rides.map((ride) => <RideCard key={ride._id} ride={ride} />)}
    </div>
  );
}

export default FindRides;
