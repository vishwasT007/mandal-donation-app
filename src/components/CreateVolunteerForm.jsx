import { useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CreateVolunteerForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to create volunteer.");
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      className="bg-gray-50 p-4 sm:p-5 rounded-xl shadow space-y-4 max-w-full"
    >
      <h2 className="text-xl font-semibold text-blue-700 text-center">
        ➕ Create Volunteer
      </h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
      >
        🚀 Create Volunteer
      </button>

      {status && (
        <p
          className={`text-sm text-center font-medium ${
            status.includes("✅")
              ? "text-green-600"
              : status.includes("❌")
              ? "text-red-500"
              : "text-gray-600"
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
};

export default CreateVolunteerForm;
