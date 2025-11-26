import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";

function CompleteProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profession: "",
    photo: null,
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false); // track if name comes from Google

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("tempToken") || localStorage.getItem("token");
        if (!token) return;

        const res = await API.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          name: res.data.name || "",
          bio: res.data.bio || "",
          profession: res.data.profession || "",
          photo: res.data.photo_url || null,
          mobile: res.data.mobile || "",
        });

        // If user has Google ID, disable editing name
        if (res.data.googleId) setIsGoogleUser(true);

      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "photo" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("tempToken") || localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing. Please log in again.");


      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSend.append(key, value);
      });

      const res = await API.put("/users/complete-profile", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { token: finalToken } = res.data;
      if (!finalToken) throw new Error("Unable to generate final authentication token.");

      localStorage.removeItem("tempToken");
      localStorage.setItem("token", finalToken);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      const token = localStorage.getItem("tempToken") || localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }


      const res = await API.put(
        "/users/complete-profile",
        { skip: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { token: finalToken } = res.data;
      if (finalToken) {
        localStorage.removeItem("tempToken");
        localStorage.setItem("token", finalToken);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to skip profile setup");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
            readOnly={isGoogleUser} // ✅ make name non-editable if from Google
          />
          <input
            type="text"
            name="bio"
            placeholder="Short Bio"
            value={formData.bio}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="profession"
            placeholder="Profession"
            value={formData.profession}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            style={{ marginBottom: "15px" }}
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number (Optional)"
            value={formData.mobile}
            onChange={handleChange}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {loading ? "Submitting..." : "Complete Registration"}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            style={{
              marginTop: "10px",
              backgroundColor: "#6c757d",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

export default CompleteProfile;
