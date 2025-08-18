import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import {
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  Home,
  BarChart3,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    // Close mobile menu when user menu opens
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close user menu when mobile menu opens
    setIsUserMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        darkMode
          ? "bg-gray-900 shadow-lg border-b border-gray-700"
          : "bg-white shadow-lg border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">G</span>
              </div>
              <span
                className={`font-bold text-lg ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Tirora Cha Raja
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-orange-100 text-orange-700"
                  : darkMode
                  ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/donate"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/donate")
                  ? "bg-orange-100 text-orange-700"
                  : darkMode
                  ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Donate</span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/admin")
                    ? "bg-orange-100 text-orange-700"
                    : darkMode
                    ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md transition-colors ${
                darkMode
                  ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  darkMode
                    ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <User className="h-5 w-5" />
                <span
                  className={`hidden sm:block text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {user?.name || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 border transition-colors ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`px-4 py-2 text-sm border-b ${
                      darkMode
                        ? "text-gray-300 border-gray-700"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    <p className="font-medium">{user?.name || "User"}</p>
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      {user?.email}
                    </p>
                    <p className="text-xs text-orange-600 font-medium capitalize">
                      {user?.role || "User"}
                    </p>
                  </div>

                  <Link
                    to="/"
                    onClick={closeAllMenus}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-orange-400"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      closeAllMenus();
                    }}
                    className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                      darkMode
                        ? "text-gray-300 hover:bg-red-900 hover:text-red-400"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-md transition-colors ${
                darkMode
                  ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 border-t transition-colors ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <Link
                to="/dashboard"
                onClick={closeAllMenus}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-orange-100 text-orange-700"
                    : darkMode
                    ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/donate"
                onClick={closeAllMenus}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/donate")
                    ? "bg-orange-100 text-orange-700"
                    : darkMode
                    ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Donate</span>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeAllMenus}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive("/admin")
                      ? "bg-orange-100 text-orange-700"
                      : darkMode
                      ? "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
