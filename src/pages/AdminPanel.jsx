import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { exportDonationsToExcel } from "../utils/exportDonationsToExcel";
import CreateVolunteerForm from "../components/CreateVolunteerForm";
import { AnimatePresence } from "framer-motion";
import {
  Settings,
  Download,
  Target,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Crown,
  CreditCard,
  X,
  FileText,
  Image,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import { generateReceiptPDF } from "../utils/generateReceiptPDF";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const AdminPanel = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [targetAmount, setTargetAmount] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedDue, setSelectedDue] = useState(null);
  const [clearMode, setClearMode] = useState("");
  const [clearing, setClearing] = useState(false);
  const [generatedReceiptUrl, setGeneratedReceiptUrl] = useState("");
  const [showReceiptSuccess, setShowReceiptSuccess] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showGallerySuccess, setShowGallerySuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(12);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    category: "Gods/Murti",
    image: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch donations
        const snapshot = await getDocs(collection(db, "donations"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonations(data);

        // Fetch target amount
        const targetRef = doc(db, "settings", "donationGoal");
        const targetSnap = await getDoc(targetRef);
        if (targetSnap.exists()) {
          setTargetAmount(targetSnap.data().targetAmount.toString());
        }

        // Fetch gallery images
        const gallerySnapshot = await getDocs(collection(db, "gallery"));
        const galleryData = gallerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched gallery images:", galleryData);
        setGalleryImages(galleryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gallery management functions
  const handleGalleryFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setGalleryForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setGalleryForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!galleryForm.image || !galleryForm.title) {
      alert("Please select an image and enter a title");
      return;
    }

    setUploadingImage(true);
    try {
      const storage = getStorage();
      const storagePath = `gallery/${Date.now()}_${galleryForm.image.name}`;
      const imageRef = ref(storage, storagePath);

      console.log("Uploading to storage path:", storagePath);
      await uploadBytes(imageRef, galleryForm.image);
      const imageUrl = await getDownloadURL(imageRef);
      console.log("Uploaded image URL:", imageUrl);

      // Save to Firestore with both URL and storage path
      const newGalleryData = {
        title: galleryForm.title,
        year: Number(galleryForm.year),
        category: galleryForm.category,
        imageUrl,
        storagePath, // Save the storage path for deletion
        uploadedAt: serverTimestamp(),
        uploadedBy: user.uid,
      };
      console.log("Saving gallery data:", newGalleryData);

      await addDoc(collection(db, "gallery"), newGalleryData);

      // Reset form and close modal
      setGalleryForm({
        title: "",
        year: new Date().getFullYear(),
        category: "Gods/Murti",
        image: null,
      });
      setShowGalleryModal(false);

      // Refresh gallery images
      const gallerySnapshot = await getDocs(collection(db, "gallery"));
      const galleryData = gallerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryImages(galleryData);

      // Show success message
      setShowGallerySuccess(true);
      setTimeout(() => setShowGallerySuccess(false), 5000);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    console.log("Attempting to delete image with ID:", imageId);

    // Use a more reliable confirmation method
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmed) {
      console.log("Delete cancelled by user");
      return;
    }

    try {
      // First, get the image data to get the storage URL
      const imageDoc = await getDoc(doc(db, "gallery", imageId));
      if (!imageDoc.exists()) {
        alert("Image not found!");
        return;
      }

      const imageData = imageDoc.data();
      console.log("Image data:", imageData);

      // Delete from Firestore first
      console.log("Deleting document from Firestore...");
      await deleteDoc(doc(db, "gallery", imageId));
      console.log("Document deleted successfully from Firestore");

      // Try to delete from Storage if storagePath exists
      if (imageData.storagePath) {
        try {
          console.log(
            "Attempting to delete from Storage:",
            imageData.storagePath
          );
          const storage = getStorage();
          const imageRef = ref(storage, imageData.storagePath);
          await deleteObject(imageRef);
          console.log("Image file deleted from Storage");
        } catch (storageError) {
          console.warn("Failed to delete from Storage:", storageError);
          // Continue even if storage deletion fails
        }
      } else if (imageData.imageUrl) {
        // Fallback: try to extract path from URL
        try {
          const url = new URL(imageData.imageUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const decodedPath = decodeURIComponent(pathMatch[1]);
            console.log(
              "Attempting to delete from Storage using URL path:",
              decodedPath
            );
            const storage = getStorage();
            const imageRef = ref(storage, decodedPath);
            await deleteObject(imageRef);
            console.log("Image file deleted from Storage using URL path");
          }
        } catch (storageError) {
          console.warn(
            "Failed to delete from Storage using URL path:",
            storageError
          );
        }
      }

      // Update local state
      setGalleryImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );

      // Show success message
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleSaveTarget = async () => {
    if (!targetAmount || isNaN(targetAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await setDoc(doc(db, "settings", "donationGoal"), {
        targetAmount: Number(targetAmount),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving target amount:", err);
      alert("Failed to save target amount. Please try again.");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDonationsToExcel(donations);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (user?.role !== "admin") return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 text-orange-600 spinner" />
          <span className="text-gray-600">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Messages */}
        <AnimatePresence>
          {deleteSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Image deleted successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 text-lg">
            Manage donations, targets, and volunteer accounts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Export Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Export Data
                  </h3>
                  <p className="text-sm text-gray-600">
                    Download donation records as Excel file
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Total Donations:</strong> {donations.length}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Total Amount:</strong> ₹
                    {donations
                      .reduce((sum, d) => sum + Number(d.amount || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full btn btn-primary"
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
              </div>
            </motion.div>

            {/* Target Amount Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Donation Target
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set the expected donation goal
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="targetAmount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Target Amount (₹)
                  </label>
                  <input
                    id="targetAmount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="form-input"
                    placeholder="Enter target amount"
                  />
                </div>

                <button
                  onClick={handleSaveTarget}
                  className="w-full btn btn-primary"
                >
                  Save Target
                </button>

                <AnimatePresence>
                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Target amount saved successfully!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Volunteer Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Volunteer Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create new volunteer accounts
                  </p>
                </div>
              </div>

              <CreateVolunteerForm />
            </motion.div>

            {/* Admin Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Admin Access
                  </h3>
                  <p className="text-sm text-gray-600">
                    You have full administrative privileges
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>View all donation records</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Export data to Excel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Manage donation targets</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Create volunteer accounts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Delete donation entries</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Statistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {donations.length}
              </p>
              <p className="text-sm text-blue-800">Total Donations</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                ₹
                {donations
                  .reduce((sum, d) => sum + Number(d.amount || 0), 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-green-800">Total Amount</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {targetAmount
                  ? `₹${Number(targetAmount).toLocaleString()}`
                  : "Not Set"}
              </p>
              <p className="text-sm text-purple-800">Target Amount</p>
            </div>
          </div>
        </motion.div>

        {/* Due (Credit) Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Due (Credit) Donations
          </h3>
          {donations.filter((d) => d.due).length === 0 ? (
            <div className="text-gray-600">No due donations.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Donor
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations
                    .filter((d) => d.due)
                    .map((d) => (
                      <tr key={d.id}>
                        <td className="px-4 py-2">{d.fullName}</td>
                        <td className="px-4 py-2">
                          ₹{Number(d.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          {d.timestamp?.seconds
                            ? new Date(
                                d.timestamp.seconds * 1000
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="btn btn-primary text-xs px-3 py-1"
                            onClick={() => {
                              setSelectedDue(d);
                              setShowClearModal(true);
                            }}
                          >
                            Clear Due
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Gallery Management */}
        <div className="mt-8 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Image className="h-5 w-5 text-orange-600" />
              Gallery Management
            </h3>
            <button
              onClick={() => setShowGalleryModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Upload Image
            </button>
          </div>

          {/* Gallery Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {galleryImages.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Images Uploaded Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by uploading some images to the gallery.
                </p>
                <button
                  onClick={() => setShowGalleryModal(true)}
                  className="btn btn-primary flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Upload First Image
                </button>
              </div>
            ) : (
              galleryImages
                .slice(
                  (currentPage - 1) * imagesPerPage,
                  currentPage * imagesPerPage
                )
                .map((image) => {
                  console.log(
                    "Rendering image:",
                    image.title,
                    "URL:",
                    image.imageUrl
                  );
                  console.log("Image data:", image);

                  return (
                    <div key={image.id} className="relative group">
                      <div
                        className="rounded-lg shadow-md bg-gray-200 border-2 border-gray-300 relative"
                        style={{
                          minHeight: "150px",
                          minWidth: "150px",
                          backgroundColor: "#f3f4f6",
                          width: "150px",
                          height: "150px",
                          overflow: "hidden",
                        }}
                      >
                        {/* Simple img tag with debugging */}
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-full h-full"
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                            visibility: "visible",
                            opacity: "1",
                            zIndex: "10",
                            objectFit: "cover",
                            objectPosition: "center",
                            position: "relative",
                          }}
                          onError={(e) => {
                            console.error(
                              "❌ Image failed to load:",
                              image.imageUrl
                            );
                            e.target.style.display = "none";
                            const fallback =
                              e.target.parentNode.querySelector(".fallback");
                            if (fallback) fallback.style.display = "flex";
                          }}
                          onLoad={(e) => {
                            console.log(
                              "✅ Image loaded successfully:",
                              image.imageUrl
                            );
                            console.log(
                              "Image dimensions:",
                              e.target.naturalWidth,
                              "x",
                              e.target.naturalHeight
                            );
                            console.log("Image element styles:", {
                              display: e.target.style.display,
                              visibility: e.target.style.visibility,
                              opacity: e.target.style.opacity,
                              width: e.target.style.width,
                              height: e.target.style.height,
                            });
                            console.log(
                              "Parent container:",
                              e.target.parentElement
                            );
                            // Force visibility
                            e.target.style.display = "block";
                            e.target.style.visibility = "visible";
                            e.target.style.opacity = "1";
                          }}
                        />

                        {/* Image Title Overlay - Fixed positioning */}
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-1"
                          style={{ zIndex: "20" }}
                        >
                          <p className="font-semibold text-xs truncate text-white leading-tight">
                            {image.title}
                          </p>
                          <p className="text-xs opacity-90 text-white leading-tight">
                            {image.year} • {image.category}
                          </p>
                        </div>

                        {/* Fallback for failed images */}
                        <div className="fallback hidden w-full h-full items-center justify-center text-gray-500 text-sm absolute inset-0">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📷</div>
                            <div>Image not available</div>
                            <div className="text-xs mt-1">
                              URL: {image.imageUrl.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delete button - Always visible */}
                      <div className="absolute top-2 right-2 z-30">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Pagination */}
          {galleryImages.length > imagesPerPage && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage} of{" "}
                {Math.ceil(galleryImages.length / imagesPerPage)}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      Math.ceil(galleryImages.length / imagesPerPage),
                      prev + 1
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(galleryImages.length / imagesPerPage)
                }
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Clear Due Modal */}
        <AnimatePresence>
          {showClearModal && selectedDue && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                  onClick={() => {
                    setShowClearModal(false);
                    setSelectedDue(null);
                    setClearMode("");
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">
                  Clear Due for {selectedDue.fullName}
                </h2>
                <p className="mb-4 text-gray-600">
                  Select payment mode to clear this due:
                </p>
                <select
                  className="form-input w-full mb-4"
                  value={clearMode}
                  onChange={(e) => setClearMode(e.target.value)}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <button
                  className="btn btn-primary w-full"
                  disabled={!clearMode || clearing}
                  onClick={async () => {
                    setClearing(true);
                    try {
                      console.log("Clearing due for donation:", selectedDue.id);
                      const update = {
                        due: false,
                        clearedBy: user.uid,
                        clearedAt: serverTimestamp(),
                        clearedMode: clearMode,
                        paymentMode: clearMode,
                      };
                      console.log("Update data:", update);
                      await setDoc(
                        doc(db, "donations", selectedDue.id),
                        update,
                        { merge: true }
                      );
                      console.log("Firestore update successful");

                      // Regenerate receipt with proper data structure
                      const updatedDonation = {
                        ...selectedDue,
                        due: false,
                        clearedBy: user.uid,
                        clearedAt: new Date(), // Use current date for receipt generation
                        clearedMode: clearMode,
                        paymentMode: clearMode,
                        timestamp: selectedDue.timestamp,
                      };
                      console.log("Regenerating receipt for:", updatedDonation);

                      try {
                        const receiptUrl = await generateReceiptPDF(
                          updatedDonation
                        );
                        console.log(
                          "Receipt regeneration successful:",
                          receiptUrl
                        );

                        // Set receipt link and show success (like donation form)
                        setGeneratedReceiptUrl(receiptUrl);
                        setShowReceiptSuccess(true);

                        // Ganpati message for SMS
                        const ganpatiPhrases = [
                          "गणपती बाप्पा मोरया! 🍀",
                          "मंगलमूर्ती मोरया! 🙏",
                          "सिद्धिविनायकाचा आशीर्वाद सदैव तुमच्यावर राहो! 🌺",
                          "गणराज गजानन जय हो! 🌟",
                          "बाप्पाच्या चरणी कृतज्ञता! 🕉️",
                        ];
                        const randomPhrase =
                          ganpatiPhrases[
                            Math.floor(Math.random() * ganpatiPhrases.length)
                          ];

                        const message = `🙏 ${selectedDue.fullName} यांचे ₹${selectedDue.amount} चे योगदान ${clearMode} द्वारे पूर्ण झाले!\n${randomPhrase}\n📄 अपडेटेड पावती receipt 👉 ${receiptUrl}`;

                        // Open SMS app after slight delay (like donation form)
                        setTimeout(() => {
                          window.location.href = `sms:${
                            selectedDue.mobile
                          }?body=${encodeURIComponent(message)}`;
                        }, 500);

                        // Clear modal and reset states
                        setShowClearModal(false);
                        setSelectedDue(null);
                        setClearMode("");

                        // Update donations list locally (remove the cleared due)
                        setDonations((prevDonations) =>
                          prevDonations.map((donation) =>
                            donation.id === selectedDue.id
                              ? {
                                  ...donation,
                                  due: false,
                                  clearedBy: user.uid,
                                  clearedAt: new Date(),
                                  clearedMode: clearMode,
                                  paymentMode: clearMode,
                                }
                              : donation
                          )
                        );

                        // Hide success message after delay
                        setTimeout(() => setShowReceiptSuccess(false), 10000);

                        // Remove the page refresh - no longer needed
                        // setTimeout(() => window.location.reload(), 2000);
                      } catch (receiptError) {
                        console.error(
                          "Receipt generation failed:",
                          receiptError
                        );
                        // Try to generate a simple receipt URL as fallback
                        const fallbackUrl = `https://tiroracharaja.in/receipt?id=${
                          updatedDonation.id || "fallback"
                        }`;
                        setGeneratedReceiptUrl(fallbackUrl);
                        setShowReceiptSuccess(true);
                        setTimeout(() => setShowReceiptSuccess(false), 5000);
                      }
                    } catch (error) {
                      console.error("Error clearing due:", error);
                      alert("Failed to clear due. Please try again.");
                    } finally {
                      setClearing(false);
                    }
                  }}
                >
                  {clearing ? "Clearing..." : "Confirm & Clear Due"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Receipt Success Message */}
        <AnimatePresence>
          {showReceiptSuccess && generatedReceiptUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-md w-full mx-4"
            >
              {/* Success Message */}
              <div className="p-4 bg-green-50 border-b border-green-200 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Due cleared successfully!
                    </p>
                    <p className="text-sm text-green-600">
                      Receipt has been regenerated with updated payment status.
                    </p>
                  </div>
                </div>
              </div>

              {/* Receipt Link */}
              <div className="p-4 bg-blue-50 rounded-b-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">
                      Updated Receipt Generated
                    </p>
                    <a
                      href={generatedReceiptUrl}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Updated Receipt
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Success Message */}
        <AnimatePresence>
          {showGallerySuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-md w-full mx-4"
            >
              {/* Success Message */}
              <div className="p-4 bg-green-50 border-b border-green-200 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Image uploaded successfully!
                    </p>
                    <p className="text-sm text-green-600">
                      The image has been added to the gallery.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Upload Modal */}
        <AnimatePresence>
          {showGalleryModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                  onClick={() => {
                    setShowGalleryModal(false);
                    setGalleryForm({
                      title: "",
                      year: new Date().getFullYear(),
                      category: "Gods/Murti",
                      image: null,
                    });
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">Upload Gallery Image</h2>

                <form onSubmit={handleImageUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={galleryForm.title}
                      onChange={handleGalleryFormChange}
                      className="form-input"
                      placeholder="Enter image title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={galleryForm.year}
                      onChange={handleGalleryFormChange}
                      className="form-input"
                      min="2017"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={galleryForm.category}
                      onChange={handleGalleryFormChange}
                      className="form-input"
                      required
                    >
                      <option value="Gods/Murti">Gods/Murti</option>
                      <option value="Charity">Charity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleGalleryFormChange}
                      className="form-input"
                      accept="image/*"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 spinner" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Image className="h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;
