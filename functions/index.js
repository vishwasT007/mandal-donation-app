const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

// Redirect route
app.get("/receipt", async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("Missing receipt ID.");
  }

  try {
    const doc = await db.collection("shortLinks").doc(id).get();

    if (!doc.exists) {
      return res.status(404).send("Receipt not found.");
    }

    const data = doc.data();
    return res.redirect(data.url);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Export the function as an HTTPS endpoint
exports.app = functions.https.onRequest(app);
