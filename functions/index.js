const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Firestore reference
const db = admin.firestore();

// Initialize Express app
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

// Export as Cloud Function endpoint
exports.app = functions.https.onRequest(app);
