import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px 20px", borderBottom: "1px solid gray", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff" }}>
    <div>
        <Link to="/" style={{ marginRight: "15px" }}>SahaYaatra</Link>
        <Link to="/find-rides" style={{ marginRight: "10px" }}>Find Rides</Link>
        <Link to="/offer-ride" style={{ marginRight: "10px" }}>Offer Ride</Link>
        <Link to="/cab-groups" style={{ marginRight: "10px" }}>Cab Groups</Link>
    </div>
    <div>
        {token ? (
        <>
            <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
        </>
        ) : (
        <>
            <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
            <Link to="/register">Register</Link>
        </>
        )}
    </div>
    </nav>

  );
}

export default Navbar;
