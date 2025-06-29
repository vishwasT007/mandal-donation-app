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
      // Add donation document with serverTimestamp
      const docRef = await addDoc(collection(db, "donations"), {
        ...form,
        timestamp: serverTimestamp(),
      });

      // Re-fetch the saved document to get accurate timestamp
      const savedDoc = await getDoc(docRef);
      const savedData = { id: docRef.id, ...savedDoc.data() };

      // Generate receipt using real Firestore timestamp
      const receiptBlobUrl = await generateReceiptPDF(savedData);
      setReceiptLink(receiptBlobUrl);

      // Trigger SMS on mobile (optional)
      const message = `🙏 Thank you ${form.fullName} for donating ₹${form.amount}! Your receipt: ${receiptBlobUrl}`;
      window.location.href = `sms:${form.mobile}?body=${encodeURIComponent(
        message
      )}`;

      // Reset form
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
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-orange-700">
        🪔 Donation Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          className="w-full border p-2 rounded"
          value={form.mobile}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          className="w-full border p-2 rounded"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Donation Amount"
          className="w-full border p-2 rounded"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select
          name="paymentMode"
          className="w-full border p-2 rounded"
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
            className="w-full border p-2 rounded"
            value={form.utrNumber}
            onChange={handleChange}
            required
          />
        )}

        <button
          type="submit"
          className="bg-orange-600 text-white w-full py-2 rounded hover:bg-orange-700"
        >
          Submit Donation
        </button>
      </form>

      {receiptLink && (
        <p className="mt-4 text-green-700">
          ✅ Receipt created:{" "}
          <a
            href={receiptLink}
            className="underline text-blue-600"
            target="_blank"
            rel="noreferrer"
          >
            View Receipt
          </a>
        </p>
      )}
    </div>
  );
};

export default DonationForm;
