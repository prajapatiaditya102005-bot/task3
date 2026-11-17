const { get, run } = require("../database/db");

function validateApplication(body) {
  const errors = [];
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const internshipId = typeof body.internshipId === "string" ? body.internshipId.trim() : "";
  const coverLetter = typeof body.coverLetter === "string" ? body.coverLetter.trim() : "";
  if (name.length < 2 || name.length > 80) errors.push("Name must be between 2 and 80 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) errors.push("Enter a valid email address.");
  if (!/^[0-9+() -]{10,15}$/.test(phone)) errors.push("Phone must contain 10-15 valid phone characters.");
  if (!/^[A-Za-z0-9-]{3,30}$/.test(internshipId)) errors.push("Select a valid internship.");
  if (coverLetter.length > 1000) errors.push("Cover letter must be 1000 characters or fewer.");
  return { errors, values: { name, email, phone, internshipId, coverLetter } };
}
async function createApplication(req, res, next) {
  try {
    const { errors, values } = validateApplication(req.body || {});
    if (errors.length) return res.status(400).json({ success: false, message: "Validation failed.", errors });
    const internship = await get("SELECT id FROM internships WHERE id = ?", [values.internshipId]);
    if (!internship) return res.status(400).json({ success: false, message: "Selected internship does not exist.", errors: ["Choose an available internship."] });
    const result = await run(
      "INSERT INTO applications (internship_id, name, email, phone, cover_letter) VALUES (?, ?, ?, ?, ?)",
      [values.internshipId, values.name, values.email, values.phone, values.coverLetter]
    );
    res.status(201).json({ success: true, message: "Application submitted successfully.", data: { id: `APP-${result.id}`, internshipId: values.internshipId } });
  } catch (error) { next(error); }
}
module.exports = { createApplication, validateApplication };
