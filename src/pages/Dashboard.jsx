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
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { user, darkMode } = useAuth();

  // Get unique years from donations
  const getUniqueYears = () => {
    const years = donations
      .map((d) => {
        if (d.timestamp?.seconds) {
          return new Date(d.timestamp.seconds * 1000).getFullYear();
        }
        return null;
      })
      .filter((year) => year !== null);
    return [...new Set(years)].sort((a, b) => b - a);
  };

  // Filter donations by selected year
  const getFilteredDonations = () => {
    if (selectedYear === "all") return donations;
    return donations.filter((d) => {
      if (d.timestamp?.seconds) {
        return (
          new Date(d.timestamp.seconds * 1000).getFullYear() === selectedYear
        );
      }
      return false;
    });
  };

  // Get paginated donations
  const getPaginatedDonations = () => {
    const filtered = getFilteredDonations();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredDonations().length / itemsPerPage);

  // Reset to first page when year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

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
      const dataToExport = getFilteredDonations();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();

      // Add year info to filename
      const yearLabel = selectedYear === "all" ? "all-years" : selectedYear;
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `Donations-${yearLabel}`
      );

      XLSX.writeFile(
        workbook,
        `donations-${yearLabel}-${new Date().toISOString().split("T")[0]}.xlsx`
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
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-200 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-orange-50 via-white to-orange-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatePresence>
          <div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
          >
            <div>
              <h1
                className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Dashboard
              </h1>
              <p
                className={`transition-colors ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
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
                      <p
                        className={`text-sm font-medium mb-1 transition-colors ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {stat.title}
                      </p>
                      <p
                        className={`text-2xl font-bold transition-colors ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
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

        {/* Recent Donations */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2
                className={`text-xl font-semibold transition-colors ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Donations
              </h2>

              {/* Filter and Export Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Year Filter */}
                <div className="flex items-center gap-2">
                  <Filter
                    className={`h-4 w-4 transition-colors ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <select
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(
                        e.target.value === "all"
                          ? "all"
                          : parseInt(e.target.value)
                      )
                    }
                    className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="all">All Years</option>
                    {getUniqueYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportToExcel}
                  disabled={exporting || getFilteredDonations().length === 0}
                  className={`btn btn-primary flex items-center gap-2 transition-colors ${
                    exporting || getFilteredDonations().length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 spinner" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export {selectedYear === "all" ? "All" : selectedYear}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-3">
              <p
                className={`text-sm transition-colors ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Showing {getFilteredDonations().length} donation
                {getFilteredDonations().length !== 1 ? "s" : ""}
                {selectedYear !== "all" && ` from ${selectedYear}`}
                {getFilteredDonations().length > 0 &&
                  ` (Page ${currentPage} of ${totalPages})`}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 spinner mx-auto mb-4 text-orange-600" />
                <p
                  className={`transition-colors ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Loading donations...
                </p>
              </div>
            ) : donations.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p
                  className={`transition-colors ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No donations found.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead
                  className={`transition-colors ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Donor
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Amount
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Payment Mode
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Status
                    </th>
                    {user?.role === "admin" && (
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y transition-colors ${
                    darkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  {getPaginatedDonations().map((donation) => (
                    <tr
                      key={donation.id}
                      className={`transition-colors ${
                        darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div
                            className={`text-sm font-medium transition-colors ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {donation.fullName}
                          </div>
                          <div
                            className={`text-sm transition-colors ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {donation.mobile}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium transition-colors ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ₹{donation.amount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            donation.paymentMode === "Credit"
                              ? "bg-yellow-100 text-yellow-800"
                              : donation.paymentMode === "UPI"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {donation.paymentMode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm transition-colors ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {donation.timestamp?.seconds
                            ? new Date(
                                donation.timestamp.seconds * 1000
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            donation.due
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {donation.due ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Due
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </>
                          )}
                        </span>
                      </td>
                      {user?.role === "admin" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(donation.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {getFilteredDonations().length > itemsPerPage && (
            <div
              className={`px-6 py-4 border-t transition-colors ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`text-sm transition-colors ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    getFilteredDonations().length
                  )}{" "}
                  of {getFilteredDonations().length} results
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Page Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-orange-600 text-white"
                              : darkMode
                              ? "text-gray-400 hover:text-white hover:bg-gray-700"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
