import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/users/profile");
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>{user.name || "Unnamed User"}'s Profile</h2>
      <p>Email: {user.email}</p>
      <p>Age: {user.age || "N/A"}</p>
      <p>Gender: {user.gender || "N/A"}</p>
      <p>Bio: {user.bio || "N/A"}</p>
      <p>Hometown: {user.hometown || "N/A"}</p>
      <p>Contact Verified: {user.contact_verified ? "Yes" : "No"}</p>
      <p>Trust Score: {user.trust_score ?? "N/A"}</p>

      <button
        onClick={() => navigate("/complete-profile")}
        style={{
          marginTop: "20px",
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Complete / Edit Profile
      </button>
    </div>
  );
}

export default Profile;
