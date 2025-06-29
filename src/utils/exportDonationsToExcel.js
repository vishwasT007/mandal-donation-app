import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportDonationsToExcel = (donations) => {
  const formatted = donations.map((donation) => ({
    Name: donation.fullName,
    Mobile: donation.mobile,
    Address: donation.address,
    Amount: donation.amount,
    "Payment Mode": donation.paymentMode,
    "UPI UTR No": donation.utrNumber || "",
    Date: donation.timestamp
      ? new Date(donation.timestamp.seconds * 1000).toLocaleString()
      : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, "donations.xlsx");
};
