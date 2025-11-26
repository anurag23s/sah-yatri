import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app-container" style={{ flex: 1, padding: "50px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>Welcome to SahaYaatra 🚗</h1>
      <p>Your platform to share rides and connect with fellow travelers safely.</p>

      <div style={{ marginTop: "30px" }}>
        <Link to="/offer-ride">
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>
            Offer a Ride
          </button>
        </Link>
        <Link to="/find-rides">
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>
            Find a Ride
          </button>
        </Link>
        <Link to="/cab-groups">
          <button style={{ padding: "10px 20px" }}>
            Join Cab Group
          </button>
        </Link>
      </div>

      <div style={{ marginTop: "40px", color: "gray", textAlign: "center" }}>
        <p>Share rides safely, save money, and make travel easier during the festive season.</p>
      </div>
    </div>
  );
}


export default Home;
