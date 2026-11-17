const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new sqlite3.Database(path.join(dataDir, "internships.db"));

function run(sql, params = []) {
  return new Promise((resolve, reject) => db.run(sql, params, function (error) {
    if (error) reject(error); else resolve({ id: this.lastID, changes: this.changes });
  }));
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (error, row) => error ? reject(error) : resolve(row)));
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (error, rows) => error ? reject(error) : resolve(rows)));
}
async function initializeDatabase() {
  await run(`CREATE TABLE IF NOT EXISTS internships (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, domain TEXT NOT NULL,
    mode TEXT NOT NULL, location TEXT NOT NULL, skills TEXT NOT NULL, openings INTEGER NOT NULL
  )`);
  await run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT, internship_id TEXT NOT NULL,
    name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    cover_letter TEXT DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (internship_id) REFERENCES internships(id)
  )`);
  const count = await get("SELECT COUNT(*) AS count FROM internships");
  if (count.count === 0) {
    const samples = [
      ["INT-101","Frontend Developer Intern","Web Development","Remote","India",JSON.stringify(["HTML","CSS","JavaScript"]),3],
      ["INT-102","Python Developer Intern","Python","Hybrid","Bengaluru",JSON.stringify(["Python","REST API","SQL"]),2],
      ["INT-103","Data Analyst Intern","Data Science","Remote","India",JSON.stringify(["Python","Pandas","Excel"]),2],
      ["INT-104","UI/UX Designer Intern","UI/UX Design","On-site","Mumbai",JSON.stringify(["Figma","Wireframing","Prototyping"]),1],
      ["INT-105","Java Developer Intern","Java","Remote","India",JSON.stringify(["Java","OOP","SQL"]),2],
      ["INT-106","React Developer Intern","Web Development","Hybrid","Pune",JSON.stringify(["React","JavaScript","CSS"]),2]
    ];
    for (const item of samples) {
      await run("INSERT INTO internships (id,title,domain,mode,location,skills,openings) VALUES (?,?,?,?,?,?,?)", item);
    }
  }
}
module.exports = { db, run, get, all, initializeDatabase };
