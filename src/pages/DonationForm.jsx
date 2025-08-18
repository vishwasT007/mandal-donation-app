import { useState } from "react";
import {
  collection,
  addDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Loader2,
  IndianRupee,
  CreditCard,
  FileText,
  Heart,
} from "lucide-react";
import { generateReceiptPDF } from "../utils/generateReceiptPDF";

const DonationForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    amount: "",
    paymentMode: "",
    utrNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { darkMode } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setSuccess(false);

    const cleanedData = {
      fullName: form.fullName.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      amount: Number(form.amount),
      paymentMode: form.paymentMode,
      utrNumber: form.paymentMode === "UPI" ? form.utrNumber.trim() : "",
      due: form.paymentMode === "Credit",
      timestamp: serverTimestamp(),
    };

    try {
      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, "donations"), cleanedData);

      // 2. Get the saved data with timestamp
      const savedDoc = await getDoc(docRef);
      const savedData = { id: docRef.id, ...savedDoc.data() };

      // 3. Generate PDF receipt
      const receiptBlobUrl = await generateReceiptPDF(savedData);
      // setReceiptLink(receiptBlobUrl); // This line is removed

      // 4. Ganpati message
      const ganpatiPhrases = [
        "गणपती बाप्पा मोरया! 🍀",
        "मंगलमूर्ती मोरया! 🙏",
        "सिद्धिविनायकाचा आशीर्वाद सदैव तुमच्यावर राहो! 🌺",
        "गणराज गजानन जय हो! 🌟",
        "बाप्पाच्या चरणी कृतज्ञता! 🕉️",
      ];
      const randomPhrase =
        ganpatiPhrases[Math.floor(Math.random() * ganpatiPhrases.length)];

      const message = `🙏 ${cleanedData.fullName} यांनी ₹${cleanedData.amount} चे योगदान दिले!\n${randomPhrase}\n📄 तुमची पावती receipt 👉 ${receiptBlobUrl}`;

      // 5. Open SMS app after slight delay
      setTimeout(() => {
        window.location.href = `sms:${
          cleanedData.mobile
        }?body=${encodeURIComponent(message)}`;
      }, 500);

      // 6. Reset form and show success
      setTimeout(() => {
        setForm({
          fullName: "",
          mobile: "",
          address: "",
          amount: "",
          paymentMode: "",
          utrNumber: "",
        });
        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }, 2000);
    } catch (err) {
      console.error("Error submitting donation:", err);
      alert("❌ Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "Enter 10-digit mobile number",
      required: true,
      pattern: "[0-9]{10}",
      maxLength: 10,
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      placeholder: "Enter your address (optional)",
      required: false,
    },
    {
      name: "amount",
      label: "Donation Amount",
      type: "number",
      placeholder: "Enter amount in ₹",
      required: true,
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <AnimatePresence>
          <div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1
              className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Make a Donation
            </h1>
            <p
              className={`text-lg transition-colors ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Support our Ganesh Chaturthi celebrations
            </p>
          </div>
        </AnimatePresence>

        {/* Form Card */}
        <AnimatePresence>
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {formFields.map((field) => {
                  return (
                    <div
                      key={field.name}
                      className={
                        field.name === "address" ? "sm:col-span-2" : ""
                      }
                    >
                      <label
                        htmlFor={field.name}
                        className={`block text-sm font-medium mb-2 transition-colors ${
                          darkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="relative">
                        {field.type === "textarea" ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            rows={3}
                            className="form-input resize-none"
                            value={form[field.name]}
                            onChange={handleChange}
                            required={field.required}
                          />
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="form-input"
                            value={form[field.name]}
                            onChange={handleChange}
                            required={field.required}
                            pattern={field.pattern}
                            maxLength={field.maxLength}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-4">
                <label
                  className={`block text-sm font-medium transition-colors ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Cash", "UPI", "Bank Transfer", "Credit"].map((mode) => (
                    <label
                      key={mode}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        form.paymentMode === mode
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          : darkMode
                          ? "border-gray-600 hover:border-gray-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value={mode}
                        checked={form.paymentMode === mode}
                        onChange={handleChange}
                        className="sr-only"
                        required
                      />
                      <div className="flex items-center space-x-2">
                        {mode === "Credit" ? (
                          <CreditCard className="h-4 w-4 text-orange-600" />
                        ) : mode === "UPI" ? (
                          <FileText className="h-4 w-4 text-blue-600" />
                        ) : (
                          <IndianRupee className="h-4 w-4 text-green-600" />
                        )}
                        <span
                          className={`text-sm font-medium transition-colors ${
                            form.paymentMode === mode
                              ? "text-orange-700 dark:text-orange-300"
                              : darkMode
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {mode}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* UTR Number Field (only for UPI) */}
              {form.paymentMode === "UPI" && (
                <div>
                  <label
                    htmlFor="utrNumber"
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    UTR Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="utrNumber"
                    name="utrNumber"
                    placeholder="Enter UTR number"
                    className="form-input"
                    value={form.utrNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Submit Donation
                  </>
                )}
              </button>
            </form>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p
                        className={`text-sm font-medium transition-colors ${
                          darkMode ? "text-green-300" : "text-green-800"
                        }`}
                      >
                        Donation submitted successfully!
                      </p>
                      <p
                        className={`text-xs transition-colors ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        Receipt has been generated and sent via SMS.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DonationForm;
