const express = require("express");
const { listInternships, getInternship } = require("../controllers/internshipController");
const router = express.Router();
router.get("/", listInternships);
router.get("/:id", getInternship);
module.exports = router;
