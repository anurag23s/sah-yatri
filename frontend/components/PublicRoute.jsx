import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    // Already logged in, redirect to homepage
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
