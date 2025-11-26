import { useState } from "react";
import API from "../services/api.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/forgot-password", { email });
      alert(data.message || "Reset link sent to your email");
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Forgot Password</h2>
        {sent ? (
          <p>Check your email for a password reset link.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
