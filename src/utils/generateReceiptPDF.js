import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // for unique file names

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

  // Hidden receipt container
  const receipt = document.createElement("div");
  receipt.style.width = "700px";
  receipt.style.padding = "40px";
  receipt.style.position = "relative";
  receipt.style.fontFamily = "'Georgia', serif";
  receipt.style.border = "2px solid #f97316";
  receipt.style.borderRadius = "12px";
  receipt.style.backgroundColor = "#fff";

  const bgDiv = document.createElement("div");
  bgDiv.style.position = "absolute";
  bgDiv.style.top = 0;
  bgDiv.style.left = 0;
  bgDiv.style.width = "100%";
  bgDiv.style.height = "100%";
  bgDiv.style.zIndex = 0;
  bgDiv.style.opacity = "0.06";
  bgDiv.innerHTML = `<img src="/bg-mahabharat.png" style="width:100%; height:100%; object-fit:cover;" />`;

  const contentDiv = document.createElement("div");
  contentDiv.style.position = "relative";
  contentDiv.style.zIndex = 1;
  contentDiv.style.lineHeight = "1.6";
  contentDiv.style.color = "#000";

  contentDiv.innerHTML = `
    <div style="text-align:center;">
      <h1 style="color:#c2410c; font-size: 24px; margin-bottom: 10px;">श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडल</h1>
      <h2 style="font-size: 18px; margin-bottom: 30px;">Donation Receipt</h2>
    </div>
    <div style="font-size: 16px;">
      <p><strong>Donor Name:</strong> ${fullName}</p>
      <p><strong>Mobile Number:</strong> ${mobile}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Amount Donated:</strong> ₹${amount}</p>
      <p><strong>Payment Mode:</strong> ${paymentMode}</p>
      ${
        paymentMode === "UPI"
          ? `<p><strong>UPI UTR Number:</strong> ${utrNumber}</p>`
          : ""
      }
      <p><strong>Date:</strong> ${date}</p>
    </div>
    <p style="text-align:center; margin-top: 40px; font-weight:bold;">
      🙏 Thank you for your generous contribution! 🙏
    </p>
  `;

  receipt.appendChild(bgDiv);
  receipt.appendChild(contentDiv);
  document.body.appendChild(receipt);

  const canvas = await html2canvas(receipt);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  const pdfBlob = pdf.output("blob");

  document.body.removeChild(receipt);

  // Upload to Firebase Storage
  const storage = getStorage();
  const fileName = `receipts/${uuidv4()}-${fullName}.pdf`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, pdfBlob);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL; // you can now send this via SMS
};
