// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DonationForm = lazy(() => import("./pages/DonationForm"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const ReceiptPage = lazy(() => import("./pages/ReceiptPage"));
const CreateVolunteerForm = lazy(() =>
  import("./components/CreateVolunteerForm")
);

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

// Main App Routes component
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading until auth status is known
  if (loading) {
    return <LoadingSpinner />;
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
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <DonationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-volunteer"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateVolunteerForm />
              </ProtectedRoute>
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

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
