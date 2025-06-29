// src/components/CreateVolunteerForm.jsx

import { useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Your Firestore config

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
      // 1️⃣ Create user via Firebase Auth REST API
      const res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBqCOlshwEtLLxi5ZZKp2BuG0UK_f3dBfs`,
        {
          email: form.email,
          password: form.password,
          returnSecureToken: true,
        }
      );

      const uid = res.data.localId;

      // 2️⃣ Add user role in Firestore
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
      className="space-y-4 bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto mt-10"
    >
      <h2 className="text-xl font-bold text-center">Create Volunteer</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create
      </button>
      <p className="text-center">{status}</p>
    </form>
  );
};

export default CreateVolunteerForm;
