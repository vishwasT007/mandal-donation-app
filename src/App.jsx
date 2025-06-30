// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Dashboard from "./pages/Dashboard";
// import DonationForm from "./pages/DonationForm";
// import AdminPanel from "./pages/AdminPanel";
// import LoginPage from "./pages/LoginPage";
// import ReceiptPage from "./pages/ReceiptPage";
// import Home from "./pages/Home"; // 👈 Home page import
// import { useAuth } from "./context/AuthContext";

// const App = () => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <div className="p-6 text-center">Loading...</div>;
//   }

//   // Don't show Navbar on Home or Login page
//   const hideNavbar =
//     location.pathname === "/" || location.pathname === "/login";

//   return (
//     <div>
//       {!hideNavbar && user && <Navbar />}

//       <div>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Home />} /> {/* 👈 Home Page */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/receipt/:id" element={<ReceiptPage />} />
//           {/* Protected Routes */}
//           <Route
//             path="/dashboard"
//             element={user ? <Dashboard /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/donate"
//             element={user ? <DonationForm /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/admin"
//             element={
//               user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />
//             }
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default App;

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
    <div className="min-h-screen bg-orange-50">
      {/* Show navbar only if user is logged in and not on login/home page */}
      {!hideNavbar && user && <Navbar />}

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
  );
};

export default App;
