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
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white overflow-hidden">
      <div className="bg-white shadow-2xl rounded-2xl px-6 py-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-700 text-center">
          👤 Admin Panel
        </h1>

        <div className="flex justify-center">
          <button
            onClick={() => exportDonationsToExcel(donations)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full"
          >
            📤 Export Donations to Excel
          </button>
        </div>

        <CreateVolunteerForm />
      </div>
    </div>
  );
};

export default AdminPanel;
