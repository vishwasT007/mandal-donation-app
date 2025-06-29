import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "donations"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonations(data);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const today = new Date();
  const isToday = (ts) => {
    if (!ts?.seconds) return false;
    const date = new Date(ts.seconds * 1000);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const totalAmount = donations.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );
  const todayDonations = donations.filter((d) => isToday(d.timestamp));
  const todayAmount = todayDonations.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(donations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
    XLSX.writeFile(workbook, "donations.xlsx");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this donation entry?")) {
      await deleteDoc(doc(db, "donations", id));
      setDonations((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/bg-mahabharat.png')",
      }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 max-w-6xl mx-auto rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-700">📊 Dashboard</h1>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Export to Excel
          </button>
        </div>

        {loading ? (
          <p>Loading donations...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-yellow-100 p-4 rounded-xl shadow text-center">
                <p className="text-sm text-gray-600">Total Collection</p>
                <h2 className="text-xl font-bold text-yellow-800">
                  ₹ {totalAmount}
                </h2>
              </div>
              <div className="bg-green-100 p-4 rounded-xl shadow text-center">
                <p className="text-sm text-gray-600">Today’s Collection</p>
                <h2 className="text-xl font-bold text-green-800">
                  ₹ {todayAmount}
                </h2>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
                <p className="text-sm text-gray-600">Total Donors</p>
                <h2 className="text-xl font-bold text-blue-800">
                  {donations.length}
                </h2>
              </div>
              <div className="bg-pink-100 p-4 rounded-xl shadow text-center">
                <p className="text-sm text-gray-600">Today’s Donors</p>
                <h2 className="text-xl font-bold text-pink-800">
                  {todayDonations.length}
                </h2>
              </div>
            </div>

            {/* Recent Donations Table */}
            <div className="bg-white shadow rounded-xl overflow-auto">
              <h2 className="text-lg font-semibold text-orange-700 p-4">
                🕑 Recent Donations
              </h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Mobile</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Payment</th>
                    <th className="px-4 py-2">Date</th>
                    {user?.role === "admin" && (
                      <th className="px-4 py-2 text-center">Delete</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {donations
                    .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
                    .slice(0, 10)
                    .map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="px-4 py-2">{d.fullName}</td>
                        <td className="px-4 py-2">{d.mobile}</td>
                        <td className="px-4 py-2">₹ {d.amount}</td>
                        <td className="px-4 py-2">{d.paymentMode}</td>
                        <td className="px-4 py-2">
                          {d.timestamp?.seconds
                            ? new Date(
                                d.timestamp.seconds * 1000
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        {user?.role === "admin" && (
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="text-red-600 hover:underline"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
