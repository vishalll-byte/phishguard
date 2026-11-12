
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { url } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL."
      });
    }

    let parsedURL;

    try {
      parsedURL = new URL(url.trim());
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL. Enter a complete URL such as https://example.com"
      });
    }

    if (!["http:", "https:"].includes(parsedURL.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are supported."
      });
    }

    const hostname = parsedURL.hostname.toLowerCase();
    const fullURL = url.trim();

    let score = 0;
    const reasons = [];

    if (parsedURL.protocol === "http:") {
      score += 15;
      reasons.push("The URL uses HTTP instead of HTTPS.");
    }

    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      score += 30;
      reasons.push("The hostname is an IP address.");
    }

    if (fullURL.includes("@")) {
      score += 20;
      reasons.push("The URL contains an @ symbol.");
    }

    if (hostname.includes("xn--")) {
      score += 25;
      reasons.push("The hostname contains encoded characters.");
    }

    const suspiciousWords = [
      "login",
      "verify",
      "password",
      "account",
      "banking",
      "wallet",
      "update"
    ];

    const matchedWords = suspiciousWords.filter((word) =>
      hostname.includes(word)
    );

    if (matchedWords.length > 0) {
      score += 15;
      reasons.push("The hostname contains suspicious keywords.");
    }

    if (hostname.split(".").length > 4) {
      score += 15;
      reasons.push("The hostname has an unusually large number of subdomains.");
    }

    if (fullURL.length > 100) {
      score += 10;
      reasons.push("The URL is unusually long.");
    }

    score = Math.min(score, 100);

    let status = "Low Risk";

    if (score >= 50) {
      status = "High Risk";
    } else if (score >= 25) {
      status = "Medium Risk";
    }

    if (reasons.length === 0) {
      reasons.push("No suspicious indicators were found by these basic checks.");
    }

    return res.status(200).json({
      success: true,
      result: {
        url: fullURL,
        domain: hostname,
        score,
        status,
        reasons,
        checkedAt: new Date().toISOString()
      },
      disclaimer:
        "This is a basic heuristic assessment, not a verified phishing detection result."
    });
  } catch (error) {
    console.error("Scan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to scan this URL."
    });
  }
});

module.exports = router;