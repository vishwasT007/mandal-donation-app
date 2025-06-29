import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DonationForm from "./pages/DonationForm";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div>
      {user && <Navbar />}
      <div className="p-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
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
        </Routes>
      </div>
    </div>
  );
};

export default App;
