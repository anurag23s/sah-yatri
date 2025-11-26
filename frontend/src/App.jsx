import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import OfferRide from "../pages/OfferRide.jsx";
import FindRides from "../pages/FindRides.jsx";
import CabGroups from "../pages/CabGroups.jsx";
import Profile from "../pages/Profile.jsx";
import CompleteProfile from "../pages/CompleteProfile.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";

// 🆕 new pages
import MyRidesPage from "../pages/MyRidesPage.jsx";
import RideDetailsPage from "../pages/RideDetailsPage.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home is protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Complete Profile – temp token access */}
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Protected Ride Routes */}
        <Route
          path="/offer-ride"
          element={
            <PrivateRoute>
              <OfferRide />
            </PrivateRoute>
          }
        />
        <Route
          path="/find-rides"
          element={
            <PrivateRoute>
              <FindRides />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-rides"
          element={
            <PrivateRoute>
              <MyRidesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/ride/:rideId"
          element={
            <PrivateRoute>
              <RideDetailsPage />
            </PrivateRoute>
          }
        />

        {/* Other protected routes */}
        <Route
          path="/cab-groups"
          element={
            <PrivateRoute>
              <CabGroups />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
