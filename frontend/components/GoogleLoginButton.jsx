import { useEffect } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleCredentialResponse = async (response) => {
    try {
      const res = await API.post("/auth/google", { tokenId: response.credential });

      if (res.data.tempToken) {
        localStorage.setItem("tempToken", res.data.tempToken);
        // Store Google data for prefill
        const payload = JSON.parse(atob(response.credential.split(".")[1])); // decode JWT payload
        localStorage.setItem(
          "googleData",
          JSON.stringify({
            name: payload.name,
            photo_url: payload.picture,
            email: payload.email,
          })
        );
        navigate("/complete-profile");
      } else if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Google login failed");
    }
  };

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleScript;
      document.body.appendChild(script);
    } else {
      loadGoogleScript();
    }
  }, []);

  return <div id="googleSignInDiv" style={{ marginTop: "15px" }}></div>;
}

export default GoogleLoginButton;
