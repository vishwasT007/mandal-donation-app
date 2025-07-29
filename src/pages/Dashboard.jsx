import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Download,
  Trash2,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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

    if (user) {
      fetchDonations();
    }
  }, [user]);

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

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const worksheet = XLSX.utils.json_to_sheet(donations);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
      XLSX.writeFile(
        workbook,
        `donations-${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this donation entry?")
    ) {
      try {
        await deleteDoc(doc(db, "donations", id));
        setDonations((prev) => prev.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete donation. Please try again.");
      }
    }
  };

  const stats = [
    {
      title: "Total Collection",
      value: `₹${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-800",
      iconColor: "text-yellow-600",
    },
    {
      title: "Today's Collection",
      value: `₹${todayAmount.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-800",
      iconColor: "text-green-600",
    },
    {
      title: "Total Donors",
      value: donations.length.toString(),
      icon: Users,
      color: "bg-blue-100 text-blue-800",
      iconColor: "text-blue-600",
    },
    {
      title: "Today's Donors",
      value: todayDonations.length.toString(),
      icon: Calendar,
      color: "bg-purple-100 text-purple-800",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatePresence>
          <div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor donation activities and manage data
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={exportToExcel}
                disabled={exporting}
                className="btn btn-primary mt-4 sm:mt-0"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 spinner" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export to Excel
                  </>
                )}
              </button>
            )}
          </div>
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatePresence key={stat.title}>
                <div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              </AnimatePresence>
            );
          })}
        </div>

        {/* Donation Table - Only for Admin */}
        {user?.role === "admin" && (
          <AnimatePresence>
            <div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  Recent Donations
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Latest donation entries from donors
                </p>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 text-orange-600 spinner" />
                      <span className="text-gray-600">
                        Loading donations...
                      </span>
                    </div>
                  </div>
                ) : donations.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No donations found</p>
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {donations
                        .sort(
                          (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
                        )
                        .slice(0, 30)
                        .map((donation) => (
                          <AnimatePresence key={donation.id}>
                            <tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {donation.fullName}
                                  </div>
                                  {donation.address && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {donation.address}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {donation.mobile}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-green-600">
                                  ₹{Number(donation.amount).toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {donation.due ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Credit (Due)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Paid by{" "}
                                    {donation.clearedMode ||
                                      donation.paymentMode}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {donation.timestamp?.seconds
                                  ? new Date(
                                      donation.timestamp.seconds * 1000
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={() => handleDelete(donation.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                                  title="Delete donation"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          </AnimatePresence>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>

              {donations.length > 30 && (
                <div className="px-6 py-4 bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">
                    Showing latest 30 donations. Export to Excel to see all
                    data.
                  </p>
                </div>
              )}
            </div>
          </AnimatePresence>
        )}

        {/* Info for Non-Admin Users */}
        {user?.role !== "admin" && (
          <AnimatePresence>
            <div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Welcome to Dashboard
                </h3>
              </div>
              <p className="text-gray-600">
                You can view donation statistics above. For detailed data
                management, please contact an administrator.
              </p>
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
