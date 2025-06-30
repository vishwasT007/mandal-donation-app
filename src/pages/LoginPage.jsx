import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const auth = getAuth();
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const docRef = doc(db, "users", res.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        navigate(role === "admin" ? "/admin" : "/");
      } else {
        setError("User role not found in database.");
      }
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
      <div className="w-full max-w-xs sm:max-w-sm mx-auto">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-lg border border-orange-100"
          style={{
            maxHeight: "90vh",
            transform: "scale(1)", // Ensures consistent scaling
          }}
        >
          <div className="text-center mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-600">
              श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडल
            </h2>
            {/* <p className="text-sm sm:text-base text-gray-600 mt-1">
              Sign in to your account
            </p> */}
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 text-sm sm:text-base font-medium text-white rounded-lg shadow-md transition ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 text-sm bg-red-50 text-red-600 rounded-lg text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
