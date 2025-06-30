import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { generateReceiptPDF } from "../utils/generateReceiptPDF";

const ReceiptPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const fetchAndGenerate = async () => {
      try {
        const docRef = doc(db, "donations", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blobUrl = await generateReceiptPDF(docSnap.data());
          window.open(blobUrl, "_blank");
          setStatus("✅ Receipt opened in a new tab.");
        } else {
          setStatus("❌ Donation not found.");
        }
      } catch (err) {
        console.error("Receipt error:", err);
        setStatus("❌ Error generating receipt.");
      }
    };

    fetchAndGenerate();
  }, [id]);

  return (
    <div className="h-screen flex items-center justify-center bg-orange-50 text-center p-4">
      <div className="text-lg text-orange-800 font-medium">{status}</div>
    </div>
  );
};

export default ReceiptPage;
