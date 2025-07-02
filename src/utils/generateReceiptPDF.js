// new code 1
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

// export const generateReceiptPDF = async (donationData) => {
//   const {
//     fullName,
//     mobile,
//     address,
//     amount,
//     paymentMode,
//     utrNumber,
//     timestamp,
//   } = donationData;

//   const date = timestamp?.seconds
//     ? new Date(timestamp.seconds * 1000).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       })
//     : "N/A";

//   // Create hidden receipt DOM
//   const receipt = document.createElement("div");
//   receipt.style.width = "700px";
//   receipt.style.padding = "40px";
//   receipt.style.position = "relative";
//   receipt.style.fontFamily = "'Arial', sans-serif";
//   receipt.style.border = "2px solid #f97316";
//   receipt.style.borderRadius = "12px";
//   receipt.style.backgroundColor = "#fff7ed";

//   // Add Ganesha image background
//   const bgDiv = document.createElement("div");
//   bgDiv.style.position = "absolute";
//   bgDiv.style.top = 0;
//   bgDiv.style.left = 0;
//   bgDiv.style.width = "100%";
//   bgDiv.style.height = "100%";
//   bgDiv.style.zIndex = 0;
//   bgDiv.style.opacity = "0.1";
//   bgDiv.innerHTML = `<img src="/ganesh1.png" style="width:100%; height:100%; object-fit:contain;" />`;

//   const contentDiv = document.createElement("div");
//   contentDiv.style.position = "relative";
//   contentDiv.style.zIndex = 1;
//   contentDiv.style.lineHeight = "1.6";
//   contentDiv.style.color = "#333";

//   contentDiv.innerHTML = `
//     <div style="text-align:center; margin-bottom:20px;">
//       <h1 style="color:#1e4a1e; font-size: 24px; margin-bottom: 5px;">श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडल</h1>
//       <h2 style="color:#c2410c; font-size: 20px; margin-bottom: 10px;">Donation Receipt</h2>
//       <div style="border-bottom:2px solid #1e4a1e; width:150px; margin:0 auto;"></div>
//     </div>

//     <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
//       <div>
//         <p style="margin:5px 0;"><strong>Receipt No:</strong> GCM-${new Date().getFullYear()}-${uuidv4()
//     .substring(0, 4)
//     .toUpperCase()}</p>
//         <p style="margin:5px 0;"><strong>Date:</strong> ${date}</p>
//       </div>
//     </div>

//     <div style="background:#f0f0f0; padding:15px; border-radius:8px; margin-bottom:20px;">
//       <h3 style="color:#1e4a1e; margin-top:0; margin-bottom:10px;">Donor Information</h3>
//       <p style="margin:8px 0;"><strong>Name:</strong> ${fullName}</p>
//       <p style="margin:8px 0;"><strong>Mobile:</strong> ${mobile}</p>
//       <p style="margin:8px 0;"><strong>Address:</strong> ${address}</p>
//     </div>

//     <div style="background:#f0f0f0; padding:15px; border-radius:8px; margin-bottom:20px;">
//       <h3 style="color:#1e4a1e; margin-top:0; margin-bottom:10px;">Donation Details</h3>
//       <p style="margin:8px 0;"><strong>Amount:</strong> ₹${Number(
//         amount
//       ).toLocaleString("en-IN")}</p>
//       <p style="margin:8px 0;"><strong>Amount in Words:</strong> ${numberToWords(
//         amount
//       )} Rupees Only</p>
//       <p style="margin:8px 0;"><strong>Payment Mode:</strong> ${paymentMode}</p>
//       ${
//         paymentMode === "UPI"
//           ? `<p style="margin:8px 0;"><strong>Transaction ID:</strong> ${utrNumber}</p>`
//           : ""
//       }
//     </div>

//     <div style="text-align:center; margin-top:30px;">
//       <p style="font-style:italic; color:#555;">Thank you for supporting our Ganesh Chaturthi celebrations</p>
//       <div style="display:flex; justify-content:center; align-items:center; margin-top:20px;">
//         <div style="border-top:1px dashed #333; width:100px; margin:0 10px;"></div>
//         <span style="font-weight:bold;">Authorized Signature</span>
//         <div style="border-top:1px dashed #333; width:100px; margin:0 10px;"></div>
//       </div>
//     </div>

//     <div style="text-align:center; margin-top:40px; font-size:12px; color:#777;">
//       <p>This is a computer generated receipt. No physical signature required.</p>
//       <p>Om Gan Ganapataye Namah</p>
//     </div>
//   `;

//   receipt.appendChild(bgDiv);
//   receipt.appendChild(contentDiv);
//   document.body.appendChild(receipt);

//   const canvas = await html2canvas(receipt);
//   const imgData = canvas.toDataURL("image/png", { quality: 0.95 });
//   const pdf = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a5",
//   });

//   pdf.addImage(imgData, "PNG", 5, 5, 140, 0);
//   const pdfBlob = pdf.output("blob");
//   document.body.removeChild(receipt);

//   // Upload to Firebase Storage
//   const storage = getStorage();
//   const fileName = `receipts/ganesh-chaturthi/${uuidv4()}-${fullName}.pdf`;
//   const storageRef = ref(storage, fileName);
//   await uploadBytes(storageRef, pdfBlob);
//   const longURL = await getDownloadURL(storageRef);

//   // Create short link in Firestore
//   const firestore = getFirestore();
//   const shortId = uuidv4().split("-")[0];
//   const shortLinkRef = doc(collection(firestore, "shortLinks"), shortId);
//   await setDoc(shortLinkRef, {
//     url: longURL,
//     donorName: fullName,
//     amount: amount,
//     date: date,
//     createdAt: new Date().toISOString(),
//   });

//   return `https://tiroracharaja.in/receipt?id=${shortId}`;
// };

// // Helper function to convert numbers to words (Indian numbering system)
// function numberToWords(num) {
//   const single = [
//     "",
//     "One",
//     "Two",
//     "Three",
//     "Four",
//     "Five",
//     "Six",
//     "Seven",
//     "Eight",
//     "Nine",
//   ];
//   const double = [
//     "Ten",
//     "Eleven",
//     "Twelve",
//     "Thirteen",
//     "Fourteen",
//     "Fifteen",
//     "Sixteen",
//     "Seventeen",
//     "Eighteen",
//     "Nineteen",
//   ];
//   const tens = [
//     "",
//     "",
//     "Twenty",
//     "Thirty",
//     "Forty",
//     "Fifty",
//     "Sixty",
//     "Seventy",
//     "Eighty",
//     "Ninety",
//   ];

//   function convertLessThanOneThousand(n) {
//     if (n === 0) return "";
//     let res = "";
//     if (n >= 100) {
//       res += single[Math.floor(n / 100)] + " Hundred ";
//       n %= 100;
//     }
//     if (n >= 20) {
//       res += tens[Math.floor(n / 10)] + " ";
//       n %= 10;
//     } else if (n >= 10) {
//       res += double[n - 10] + " ";
//       n = 0;
//     }
//     if (n > 0) {
//       res += single[n] + " ";
//     }
//     return res;
//   }

//   if (num === 0) return "Zero";
//   let result = "";

//   // Handle lakhs
//   if (num >= 100000) {
//     const lakhs = Math.floor(num / 100000);
//     result += convertLessThanOneThousand(lakhs) + "Lakh ";
//     num %= 100000;
//   }

//   // Handle thousands
//   if (num >= 1000) {
//     const thousands = Math.floor(num / 1000);
//     result += convertLessThanOneThousand(thousands) + "Thousand ";
//     num %= 1000;
//   }

//   // Handle remainder
//   result += convertLessThanOneThousand(num);

//   return result.trim();
// }

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const generateReceiptPDF = async (donationData) => {
  const {
    fullName,
    mobile,
    address,
    amount,
    paymentMode,
    utrNumber,
    timestamp,
  } = donationData;

  const date = timestamp?.seconds
    ? new Date(timestamp.seconds * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const receipt = document.createElement("div");
  receipt.style.width = "700px";
  receipt.style.padding = "40px";
  receipt.style.position = "relative";
  receipt.style.fontFamily = "'Arial', sans-serif";
  receipt.style.border = "2px solid #f97316";
  receipt.style.borderRadius = "12px";
  receipt.style.backgroundColor = "#fff7ed";

  const bgDiv = document.createElement("div");
  bgDiv.style.position = "absolute";
  bgDiv.style.top = 0;
  bgDiv.style.left = 0;
  bgDiv.style.width = "100%";
  bgDiv.style.height = "100%";
  bgDiv.style.zIndex = 0;
  bgDiv.style.opacity = "0.1";
  bgDiv.innerHTML = `<img src="/ganesh1.png" style="width:100%; height:100%; object-fit:contain;" />`;

  const contentDiv = document.createElement("div");
  contentDiv.style.position = "relative";
  contentDiv.style.zIndex = 1;
  contentDiv.style.lineHeight = "1.6";
  contentDiv.style.color = "#333";

  contentDiv.innerHTML = `
    <div style="text-align:center; margin-bottom:20px;">
      <h1 style="color:#1e4a1e; font-size: 24px; margin-bottom: 5px;">श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडल</h1>
      <h2 style="color:#c2410c; font-size: 20px; margin-bottom: 10px;">Donation Receipt</h2>
      <div style="border-bottom:2px solid #1e4a1e; width:150px; margin:0 auto;"></div>
    </div>
    
    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
      <div>
        <p style="margin:5px 0;"><strong>Receipt No:</strong> GCM-${new Date().getFullYear()}-${uuidv4()
    .substring(0, 4)
    .toUpperCase()}</p>
        <p style="margin:5px 0;"><strong>Date:</strong> ${date}</p>
      </div>
    </div>
    
    <div style="background:#f0f0f0; padding:15px; border-radius:8px; margin-bottom:20px;">
      <h3 style="color:#1e4a1e; margin-top:0; margin-bottom:10px;">Donor Information</h3>
      <p style="margin:8px 0;"><strong>Name:</strong> ${fullName}</p>
      <p style="margin:8px 0;"><strong>Mobile:</strong> ${mobile}</p>
      <p style="margin:8px 0;"><strong>Address:</strong> ${address}</p>
    </div>
    
    <div style="background:#f0f0f0; padding:15px; border-radius:8px; margin-bottom:20px;">
      <h3 style="color:#1e4a1e; margin-top:0; margin-bottom:10px;">Donation Details</h3>
      <p style="margin:8px 0;"><strong>Amount:</strong> ₹${Number(
        amount
      ).toLocaleString("en-IN")}</p>
      <p style="margin:8px 0;"><strong>Amount in Words:</strong> ${numberToWords(
        amount
      )} Rupees Only</p>
      <p style="margin:8px 0;"><strong>Payment Mode:</strong> ${paymentMode}</p>
      ${
        paymentMode === "UPI"
          ? `<p style="margin:8px 0;"><strong>Transaction ID:</strong> ${utrNumber}</p>`
          : ""
      }
    </div>
    
    <div style="text-align:center; margin-top:30px;">
      <p style="font-style:italic; color:#555;">Thank you for supporting our Ganesh Chaturthi celebrations</p>
      <div style="display:flex; justify-content:center; align-items:center; margin-top:20px;">
        <div style="border-top:1px dashed #333; width:100px; margin:0 10px;"></div>
        <span style="font-weight:bold;">Authorized Signature</span>
        <div style="border-top:1px dashed #333; width:100px; margin:0 10px;"></div>
      </div>
    </div>
    
    <div style="text-align:center; margin-top:40px; font-size:12px; color:#777;">
      <p>This is a computer generated receipt. No physical signature required.</p>
      <p>Om Gan Ganapataye Namah</p>
    </div>
  `;

  receipt.appendChild(bgDiv);
  receipt.appendChild(contentDiv);
  document.body.appendChild(receipt);

  // Optimization: use JPEG instead of PNG & reduce quality
  const canvas = await html2canvas(receipt, { scale: 2 });
  const imgData = canvas.toDataURL("image/jpeg", 0.6); // lower quality but still good visual
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
    compress: true, // enable compression
  });

  pdf.addImage(imgData, "JPEG", 5, 5, 140, 0, undefined, "FAST"); // JPEG with compression
  const pdfBlob = pdf.output("blob");
  document.body.removeChild(receipt);

  // Upload to Firebase Storage
  const storage = getStorage();
  const fileName = `receipts/ganesh-chaturthi/${uuidv4()}-${fullName}.pdf`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, pdfBlob);
  const longURL = await getDownloadURL(storageRef);

  // Create short link in Firestore
  const firestore = getFirestore();
  const shortId = uuidv4().split("-")[0];
  const shortLinkRef = doc(collection(firestore, "shortLinks"), shortId);
  await setDoc(shortLinkRef, {
    url: longURL,
    donorName: fullName,
    amount: amount,
    date: date,
    createdAt: new Date().toISOString(),
  });

  return `https://tiroracharaja.in/receipt?id=${shortId}`;
};

// Helper function remains unchanged
function numberToWords(num) {
  const single = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const double = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertLessThanOneThousand(n) {
    if (n === 0) return "";
    let res = "";
    if (n >= 100) {
      res += single[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      res += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    } else if (n >= 10) {
      res += double[n - 10] + " ";
      n = 0;
    }
    if (n > 0) {
      res += single[n] + " ";
    }
    return res;
  }

  if (num === 0) return "Zero";
  let result = "";

  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    result += convertLessThanOneThousand(lakhs) + "Lakh ";
    num %= 100000;
  }

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += convertLessThanOneThousand(thousands) + "Thousand ";
    num %= 1000;
  }

  result += convertLessThanOneThousand(num);
  return result.trim();
}
