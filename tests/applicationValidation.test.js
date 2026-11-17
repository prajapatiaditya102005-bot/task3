const test = require("node:test");
const assert = require("node:assert/strict");
const { validateApplication } = require("../controllers/applicationController");

test("accepts a valid application payload", () => {
  const result = validateApplication({
    internshipId: "INT-101", name: "Aditya Kumar", email: "aditya@example.com",
    phone: "9876543210", coverLetter: "I know JavaScript."
  });
  assert.deepEqual(result.errors, []);
  assert.equal(result.values.internshipId, "INT-101");
});

test("rejects invalid email, short name and phone", () => {
  const result = validateApplication({
    internshipId: "INT-101", name: "A", email: "not-an-email", phone: "123", coverLetter: ""
  });
  assert.ok(result.errors.length >= 3);
});

test("rejects malformed internship identifiers", () => {
  const result = validateApplication({
    internshipId: "1; DROP TABLE internships", name: "Test User",
    email: "test@example.com", phone: "9876543210", coverLetter: ""
  });
  assert.ok(result.errors.some(error => error.includes("internship")));
});
