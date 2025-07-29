// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DonationForm from "./pages/DonationForm";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import ReceiptPage from "./pages/ReceiptPage";
import Home from "./pages/Home";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading until auth status is known
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-orange-700 font-semibold text-lg">
        Loading...
      </div>
    );
  }

  // Don't show Navbar on home or login page
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Show navbar only if user is logged in and not on login/home page */}
      {!hideNavbar && user && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/receipt/:id" element={<ReceiptPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/donate"
            element={user ? <DonationForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />
            }
          />

          {/* Catch-all route to redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Developed by{" "}
            <span className="font-medium text-gray-700">Vishwas Tarende</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
