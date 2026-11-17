const express = require("express");
const { rateLimit } = require("express-rate-limit");
const { createApplication } = require("../controllers/applicationController");
const router = express.Router();
const applicationLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: "draft-7", legacyHeaders: false, message: { success: false, message: "Too many applications. Please try again later." } });
router.post("/", applicationLimiter, createApplication);
module.exports = router;
