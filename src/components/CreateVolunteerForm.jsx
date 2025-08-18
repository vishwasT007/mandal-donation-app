import { useState, useEffect } from "react";
import axios from "axios";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CreateVolunteerForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const { darkMode } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setStatus("Creating...");

    try {
      const res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBqCOlshwEtLLxi5ZZKp2BuG0UK_f3dBfs`,
        {
          email: form.email,
          password: form.password,
          returnSecureToken: true,
        }
      );

      const uid = res.data.localId;

      await setDoc(doc(db, "users", uid), {
        name: form.name,
        role: "volunteer",
      });

      setStatus("✅ Volunteer created successfully!");
      setForm({ name: "", email: "", password: "" });
      fetchVolunteers();
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to create volunteer.");
    }
  };

  const fetchVolunteers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const data = [];
    snapshot.forEach((docSnap) => {
      const user = docSnap.data();
      if (user.role === "volunteer") {
        data.push({ name: user.name });
      }
    });
    setVolunteers(data);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className={`p-4 sm:p-5 rounded-xl shadow space-y-4 max-w-full transition-colors ${
          darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-gray-50"
        }`}
      >
        <h2
          className={`text-xl font-semibold text-center transition-colors ${
            darkMode ? "text-blue-400" : "text-blue-700"
          }`}
        >
          ➕ Create Volunteer
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          required
        />

        <div className="relative">
          <input
            name="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute right-3 top-2.5 transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
        >
          🚀 Create Volunteer
        </button>

        {status && (
          <p
            className={`text-sm text-center font-medium transition-colors ${
              status.includes("✅")
                ? "text-green-500"
                : status.includes("❌")
                ? "text-red-400"
                : darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            {status}
          </p>
        )}
      </form>

      {volunteers.length > 0 && (
        <div
          className={`rounded-xl shadow p-4 max-w-full transition-colors ${
            darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-3 transition-colors ${
              darkMode ? "text-blue-400" : "text-blue-700"
            }`}
          >
            🙋 Volunteer List
          </h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {volunteers.map((v, index) => (
              <li
                key={index}
                className={`border rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  darkMode
                    ? "border-blue-800/50 bg-blue-900/20 text-blue-200"
                    : "border-blue-100 bg-blue-50 text-gray-800"
                }`}
              >
                {v.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateVolunteerForm;
