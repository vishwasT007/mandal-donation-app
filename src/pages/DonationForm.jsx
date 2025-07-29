import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { generateReceiptPDF } from "../utils/generateReceiptPDF";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  IndianRupee,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Heart,
} from "lucide-react";

const DonationForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    amount: "",
    paymentMode: "",
    utrNumber: "",
  });

  const [receiptLink, setReceiptLink] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setReceiptLink(receiptBlobUrl);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 px-4">
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Make a Donation
            </h1>
            <p className="text-gray-600 text-lg">
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
                        className="block text-sm font-medium text-gray-700 mb-2"
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                            pattern={field.pattern}
                            maxLength={field.maxLength}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Mode */}
              <div>
                <label
                  htmlFor="paymentMode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="paymentMode"
                    name="paymentMode"
                    className="form-input"
                    value={form.paymentMode}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
              </div>

              {/* UTR Number for UPI */}
              <AnimatePresence>
                {form.paymentMode === "UPI" && (
                  <div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label
                      htmlFor="utrNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      UPI Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="utrNumber"
                        name="utrNumber"
                        type="text"
                        placeholder="Enter UPI transaction ID"
                        className="form-input"
                        value={form.utrNumber}
                        onChange={handleChange}
                        required={form.paymentMode === "UPI"}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn btn-primary text-lg py-4 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 spinner" />
                    Processing Donation...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    Submit Donation
                  </>
                )}
              </button>
            </form>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        Donation submitted successfully!
                      </p>
                      <p className="text-sm text-green-600">
                        Receipt has been generated and SMS sent.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Receipt Link */}
            {receiptLink && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">
                      Receipt Generated
                    </p>
                    <a
                      href={receiptLink}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Receipt
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimatePresence>

        {/* Info Card */}
        <AnimatePresence>
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 card p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Important Information
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • All donations are used for Ganesh Chaturthi celebrations
                  </li>
                  <li>
                    • Receipt will be automatically generated and sent via SMS
                  </li>
                  <li>• For UPI payments, please provide the transaction ID</li>
                  <li>
                    • Your contribution helps organize cultural and social
                    events
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DonationForm;
