import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { exportDonationsToExcel } from "../utils/exportDonationsToExcel";
import CreateVolunteerForm from "../components/CreateVolunteerForm";

const AdminPanel = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);

  // 🔄 Fetch all donations
  useEffect(() => {
    const fetchDonations = async () => {
      const snapshot = await getDocs(collection(db, "donations"));
      const data = snapshot.docs.map((doc) => doc.data());
      setDonations(data);
    };

    fetchDonations();
  }, []);

  if (user?.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">
        👤 Admin Panel
      </h1>

      {/* Export Button */}
      <button
        onClick={() => exportDonationsToExcel(donations)}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        📤 Export Donations to Excel
      </button>

      {/* Create Volunteer */}
      <CreateVolunteerForm />
    </div>
  );
};

export default AdminPanel;
