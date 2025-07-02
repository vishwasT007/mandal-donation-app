// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const express = require("express");
// const cors = require("cors");

// // Initialize Firebase Admin SDK
// admin.initializeApp();

// // Firestore reference
// const db = admin.firestore();

// // Initialize Express app
// const app = express();
// app.use(cors({ origin: true }));

// // 📄 Route: /receipt?id=SHORT_ID
// app.get("/receipt", async (req, res) => {
//   const id = req.query.id;

//   if (!id) {
//     return res.status(400).send("❌ Missing receipt ID.");
//   }

//   try {
//     const doc = await db.collection("shortLinks").doc(id).get();

//     if (!doc.exists) {
//       return res.status(404).send("❌ Receipt not found.");
//     }

//     const { url } = doc.data();
//     return res.redirect(url);
//   } catch (error) {
//     console.error("🔥 Redirect error:", error);
//     return res.status(500).send("❌ Internal Server Error");
//   }
// });

// // Export as Cloud Function endpoint
// exports.app = functions.https.onRequest(app);

// new code

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// ---------------------------------------------
// ✅ Express App for Receipt Redirects
// ---------------------------------------------
const app = express();
app.use(cors({ origin: true }));

// 📄 Route: /receipt?id=SHORT_ID
app.get("/receipt", async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("❌ Missing receipt ID.");
  }

  try {
    const doc = await db.collection("shortLinks").doc(id).get();

    if (!doc.exists) {
      return res.status(404).send("❌ Receipt not found.");
    }

    const { url } = doc.data();
    return res.redirect(url);
  } catch (error) {
    console.error("🔥 Redirect error:", error);
    return res.status(500).send("❌ Internal Server Error");
  }
});

// Export as Express Cloud Function endpoint
exports.app = functions.https.onRequest(app);

// ---------------------------------------------
// ✅ Callable Function: deleteVolunteer
// ---------------------------------------------
exports.deleteVolunteer = functions.https.onCall(async (data, context) => {
  const requesterUid = context.auth?.uid;
  const { targetUid } = data;

  if (!requesterUid) {
    throw new functions.https.HttpsError("unauthenticated", "Not signed in.");
  }

  try {
    // Fetch requester info
    const requesterDoc = await db.doc(`users/${requesterUid}`).get();
    if (!requesterDoc.exists || requesterDoc.data().role !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can delete volunteers."
      );
    }

    // Delete from Firebase Auth
    await admin.auth().deleteUser(targetUid);

    // Delete Firestore user document
    await db.doc(`users/${targetUid}`).delete();

    return { success: true };
  } catch (err) {
    console.error("❌ Error deleting volunteer:", err);
    throw new functions.https.HttpsError(
      "internal",
      "Error deleting volunteer."
    );
  }
});
