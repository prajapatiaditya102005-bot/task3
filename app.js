const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const internshipRoutes = require("./routes/internshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN.split(",").map(origin => origin.trim()) }));
}
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (req, res) => res.json({ success: true, message: "InternBoard API is running." }));
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));
app.use(errorHandler);
module.exports = app;
