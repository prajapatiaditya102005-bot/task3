const { all, get } = require("../database/db");

async function listInternships(req, res, next) {
  try {
    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = Number.parseInt(req.query.limit || "10", 10);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({ success: false, message: "Invalid pagination. page must be >= 1 and limit must be 1-50." });
    }
    const offset = (page - 1) * limit;
    const rows = await all("SELECT * FROM internships ORDER BY title LIMIT ? OFFSET ?", [limit, offset]);
    const total = await get("SELECT COUNT(*) AS total FROM internships");
    const data = rows.map(row => ({ ...row, skills: JSON.parse(row.skills) }));
    res.json({ success: true, message: "Internships fetched.", data, pagination: { page, limit, total: total.total, totalPages: Math.ceil(total.total / limit) } });
  } catch (error) { next(error); }
}
async function getInternship(req, res, next) {
  try {
    const row = await get("SELECT * FROM internships WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: "Internship not found." });
    res.json({ success: true, message: "Internship fetched.", data: { ...row, skills: JSON.parse(row.skills) } });
  } catch (error) { next(error); }
}
module.exports = { listInternships, getInternship };
