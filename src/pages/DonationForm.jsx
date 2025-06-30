import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
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

  const [receiptLink, setReceiptLink] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "donations"), {
        ...form,
        timestamp: serverTimestamp(),
      });

      const savedDoc = await getDoc(docRef);
      const savedData = { id: docRef.id, ...savedDoc.data() };

      const receiptBlobUrl = await generateReceiptPDF(savedData);
      setReceiptLink(receiptBlobUrl);

      const message = `🙏 Thank you ${form.fullName} for donating ₹${form.amount}! Your receipt: ${receiptBlobUrl}`;
      window.location.href = `sms:${form.mobile}?body=${encodeURIComponent(
        message
      )}`;

      setForm({
        fullName: "",
        mobile: "",
        address: "",
        amount: "",
        paymentMode: "",
        utrNumber: "",
      });
    } catch (err) {
      console.error("Error submitting donation:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-start pt-8 justify-center px-4 pb-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-orange-700 text-center">
          🪔 Donation Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.mobile}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.address}
            onChange={handleChange}
          />
          <input
            type="number"
            name="amount"
            placeholder="Donation Amount"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <select
            name="paymentMode"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.paymentMode}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          {form.paymentMode === "UPI" && (
            <input
              type="text"
              name="utrNumber"
              placeholder="UPI UTR Number"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.utrNumber}
              onChange={handleChange}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition"
          >
            🙏 Submit Donation
          </button>
        </form>

        {receiptLink && (
          <div className="text-center text-green-700 font-medium text-sm py-2">
            ✅ Receipt created:{" "}
            <a
              href={receiptLink}
              className="underline text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              View Receipt
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationForm;
