
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const scanRoutes = require("./routes/scan");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PhishGuard Backend is Running!"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PhishGuard API is working!",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);

// Unknown routes return JSON, not an HTML page
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Handle server errors as JSON
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PhishGuard Backend running on port ${PORT}`);

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing from backend/.env");
    return;
  }

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
      console.error("MongoDB Connection Failed:", error.message);
    });
});