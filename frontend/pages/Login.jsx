import { useState } from "react";
import API from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to SahaYaatra to share or find rides</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: "10px" }}>
          <Link to="/forgot-password" style={{ color: "#007bff" }}>
            Forgot Password?
          </Link>
        </p>

        <p>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>

        <p>OR</p>
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default Login;
