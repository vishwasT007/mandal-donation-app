import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl shrink-0">🪷</span>
          <span
            className="text-sm sm:text-base font-semibold text-orange-700 truncate leading-tight"
            title="श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडल"
          >
            श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडल
          </span>
        </div>

        {/* Hamburger Menu (Mobile Only) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 text-orange-700 hover:text-orange-900"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/dashboard" className="hover:text-orange-600">
            Dashboard
          </Link>
          <Link to="/donate" className="hover:text-orange-600">
            Donate
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-orange-600">
              Create
            </Link>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">
                {user.role === "admin" ? "Admin" : user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 bg-white border-t border-orange-200 text-sm text-gray-800">
          <Link
            to="/dashboard"
            className="hover:text-orange-600"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/donate"
            className="hover:text-orange-600"
            onClick={toggleMenu}
          >
            Donation Form
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hover:text-orange-600"
              onClick={toggleMenu}
            >
              Admin Panel
            </Link>
          )}
          {user && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                {user.role === "admin" ? "Admin" : user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
