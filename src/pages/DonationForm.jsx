// import { useState } from "react";
// import { db } from "../firebase";
// import {
//   collection,
//   addDoc,
//   getDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { generateReceiptPDF } from "../utils/generateReceiptPDF";

// const DonationForm = () => {
//   const [form, setForm] = useState({
//     fullName: "",
//     mobile: "",
//     address: "",
//     amount: "",
//     paymentMode: "",
//     utrNumber: "",
//   });

//   const [receiptLink, setReceiptLink] = useState(null);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // 1. Save donation to Firestore
//       const docRef = await addDoc(collection(db, "donations"), {
//         ...form,
//         timestamp: serverTimestamp(),
//       });

//       // 2. Fetch full document
//       const savedDoc = await getDoc(docRef);
//       const savedData = { id: docRef.id, ...savedDoc.data() };

//       // 3. Generate PDF and upload to Firebase Storage
//       const receiptBlobUrl = await generateReceiptPDF(savedData);
//       setReceiptLink(receiptBlobUrl);

//       // 4. Marathi thank-you message with dynamic Ganpati Bappa phrase
//       const ganpatiPhrases = [
//         "गणपती बाप्पा मोरया! 🍀",
//         "मंगलमूर्ती मोरया! 🙏",
//         "सिद्धिविनायकाचा आशीर्वाद सदैव तुमच्यावर राहो! 🌺",
//         "गणराज गजानन जय हो! 🌟",
//         "बाप्पाच्या चरणी कृतज्ञता! 🕉️",
//       ];
//       const randomPhrase =
//         ganpatiPhrases[Math.floor(Math.random() * ganpatiPhrases.length)];

//       const message = `🙏 ${form.fullName} यांनी ₹${form.amount} चे योगदान दिले!\n${randomPhrase}\n📄 तुमची पावती receipt 👉 ${receiptBlobUrl}`;

//       // 5. Open SMS app with message
//       window.location.href = `sms:${form.mobile}?body=${encodeURIComponent(
//         message
//       )}`;

//       // 6. Reset form
//       setForm({
//         fullName: "",
//         mobile: "",
//         address: "",
//         amount: "",
//         paymentMode: "",
//         utrNumber: "",
//       });
//     } catch (err) {
//       console.error("Error submitting donation:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-start pt-8 justify-center px-4 pb-4">
//       <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-6">
//         <h2 className="text-3xl font-bold text-orange-700 text-center">
//           🪔 Donation Form
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="fullName"
//             placeholder="Full Name"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             value={form.fullName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="tel"
//             name="mobile"
//             placeholder="Mobile Number"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             value={form.mobile}
//             onChange={handleChange}
//             required
//           />
//           <textarea
//             name="address"
//             placeholder="Address"
//             rows={2}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             value={form.address}
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             name="amount"
//             placeholder="Donation Amount"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             value={form.amount}
//             onChange={handleChange}
//             required
//           />
//           <select
//             name="paymentMode"
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
//             value={form.paymentMode}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Payment Mode</option>
//             <option value="Cash">Cash</option>
//             <option value="UPI">UPI</option>
//             <option value="Bank Transfer">Bank Transfer</option>
//           </select>

//           {form.paymentMode === "UPI" && (
//             <input
//               type="text"
//               name="utrNumber"
//               placeholder="UPI UTR Number"
//               className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//               value={form.utrNumber}
//               onChange={handleChange}
//               required
//             />
//           )}

//           <button
//             type="submit"
//             className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition"
//           >
//             🙏 Submit Donation
//           </button>
//         </form>

//         {receiptLink && (
//           <div className="text-center text-green-700 font-medium text-sm py-2">
//             ✅ Receipt created:{" "}
//             <a
//               href={receiptLink}
//               className="underline text-blue-600"
//               target="_blank"
//               rel="noreferrer"
//             >
//               View Receipt
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DonationForm;

/// New code

import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDoc,
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

    // Prepare and sanitize form data
    const cleanedData = {
      fullName: form.fullName.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      amount: Number(form.amount),
      paymentMode: form.paymentMode,
      utrNumber: form.paymentMode === "UPI" ? form.utrNumber.trim() : "",
      timestamp: serverTimestamp(),
    };

    try {
      console.log("Submitting donation:", cleanedData);

      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, "donations"), cleanedData);

      // 2. Get complete data (with timestamp)
      const savedDoc = await getDoc(docRef);
      const savedData = { id: docRef.id, ...savedDoc.data() };

      // 3. Generate & upload PDF
      const receiptBlobUrl = await generateReceiptPDF(savedData);
      setReceiptLink(receiptBlobUrl);

      // 4. Marathi SMS message with rotating Ganpati phrase
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

      // 5. Open SMS app
      window.location.href = `sms:${
        cleanedData.mobile
      }?body=${encodeURIComponent(message)}`;

      // 6. Reset form
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
      alert("❌ Something went wrong. Please try again.");
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
            pattern="[0-9]{10}"
            maxLength={10}
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
