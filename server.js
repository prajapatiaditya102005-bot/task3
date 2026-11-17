const app = require("./app");
const { initializeDatabase } = require("./database/db");
const PORT = Number(process.env.PORT) || 5000;

initializeDatabase()
  .then(() => app.listen(PORT, () => console.log(`InternBoard running at http://localhost:${PORT}`)))
  .catch((error) => { console.error("Database initialization failed:", error); process.exit(1); });
