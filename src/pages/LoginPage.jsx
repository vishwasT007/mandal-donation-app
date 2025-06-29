import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const auth = getAuth();
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Optional: fetch user role here, or just rely on context auto-fetch
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
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700">
          Login
        </button>
        {error && <p className="mt-3 text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
