# InternBoard — Secure Application Integration (Task 3)

A simple static frontend connected to a Node.js/Express API with SQLite persistence.

## Features delivered
- Frontend loads internship records from `GET /api/internships` instead of a hard-coded JavaScript array.
- Visible loading, empty, and failure states; search and domain filtering use API data.
- Application form with browser validation and independent server-side validation.
- Applications are stored in SQLite using parameterized SQL statements.
- Helmet security headers, JSON body size limit, global API rate limit, and stricter application-submission rate limit.
- Automated validation tests using Node's built-in test runner.

## Requirements
- Node.js 18+
- npm

## Run
```bash
npm install
npm run dev
```
Open **http://localhost:5000**. The frontend and API use the same origin, so no frontend API URL configuration is needed.

For production:
```bash
npm start
```

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/internships?page=1&limit=10` | List internships with pagination |
| GET | `/api/internships/INT-101` | Internship detail |
| POST | `/api/applications` | Submit an application |

### Application POST body
```json
{
  "internshipId": "INT-101",
  "name": "Aditya Kumar",
  "email": "aditya@example.com",
  "phone": "9876543210",
  "coverLetter": "I am interested in this role."
}
```

## Security notes
- Helmet sets common HTTP security headers.
- API requests are limited to 100 per 15 minutes per IP.
- Application submissions are limited to 5 per hour per IP.
- JSON request bodies are limited to 10 KB.
- SQL uses `?` placeholders and bound values; user input is never concatenated into SQL.
- The server validates every application field even if browser validation is bypassed.
- CORS is open by default for local learning. Set `CORS_ORIGIN` to a comma-separated allowlist of trusted frontend origins when deploying the API separately.

## Tests
```bash
npm test
```
Tests cover valid and invalid application payloads and malformed internship IDs.

## Database
SQLite creates `data/internships.db` automatically. Six sample internship records are inserted only when the internships table is empty. Submitted applications persist in the `applications` table. The database file is ignored by Git.
