// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { exportDonationsToExcel } from "../utils/exportDonationsToExcel";
// import CreateVolunteerForm from "../components/CreateVolunteerForm";

// const AdminPanel = () => {
//   const { user } = useAuth();
//   const [donations, setDonations] = useState([]);

//   useEffect(() => {
//     const fetchDonations = async () => {
//       const snapshot = await getDocs(collection(db, "donations"));
//       const data = snapshot.docs.map((doc) => doc.data());
//       setDonations(data);
//     };

//     fetchDonations();
//   }, []);

//   if (user?.role !== "admin") return <Navigate to="/" />;

//   return (
//     <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white overflow-hidden">
//       <div className="bg-white shadow-2xl rounded-2xl px-6 py-8 w-full max-w-md space-y-6">
//         <h1 className="text-2xl md:text-3xl font-bold text-orange-700 text-center">
//           👤 Admin Panel
//         </h1>

//         <div className="flex justify-center">
//           <button
//             onClick={() => exportDonationsToExcel(donations)}
//             className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full"
//           >
//             📤 Export Donations to Excel
//           </button>
//         </div>

//         <CreateVolunteerForm />
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { exportDonationsToExcel } from "../utils/exportDonationsToExcel";
import CreateVolunteerForm from "../components/CreateVolunteerForm";

const AdminPanel = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [targetAmount, setTargetAmount] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      const snapshot = await getDocs(collection(db, "donations"));
      const data = snapshot.docs.map((doc) => doc.data());
      setDonations(data);
    };

    const fetchTarget = async () => {
      const targetRef = doc(db, "settings", "donationGoal");
      const targetSnap = await getDoc(targetRef);
      if (targetSnap.exists()) {
        setTargetAmount(targetSnap.data().targetAmount);
      }
    };

    fetchDonations();
    fetchTarget();
  }, []);

  const handleSaveTarget = async () => {
    try {
      await setDoc(doc(db, "settings", "donationGoal"), {
        targetAmount: Number(targetAmount),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving target amount:", err);
    }
  };

  if (user?.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="h-full min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-white overflow-auto p-4">
      <div className="bg-white shadow-2xl rounded-2xl px-6 py-8 w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-orange-700 text-center">
          👤 Admin Panel
        </h1>

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={() => exportDonationsToExcel(donations)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full"
          >
            📤 Export Donations to Excel
          </button>
        </div>

        {/* Target Amount */}
        <div className="bg-orange-50 p-4 rounded-xl border">
          <h2 className="text-lg font-semibold text-orange-600 mb-2">
            🎯 Expected Donation Target (₹)
          </h2>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 mb-2 focus:ring-2 focus:ring-orange-400"
            placeholder="Enter amount"
          />
          <button
            onClick={handleSaveTarget}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Save Target
          </button>
          {saved && (
            <p className="text-green-600 mt-2 font-medium">
              ✅ Target amount saved!
            </p>
          )}
        </div>

        {/* Volunteer Creation Form */}
        <CreateVolunteerForm />
      </div>
    </div>
  );
};

export default AdminPanel;
