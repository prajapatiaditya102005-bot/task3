const API_BASE = ""; // Frontend and API are served from the same Express server.
const searchInput = document.getElementById("search");
const domainSelect = document.getElementById("domain");
const internshipList = document.getElementById("internshipList");
const statusText = document.getElementById("status");
const filterForm = document.getElementById("filterForm");
const applicationForm = document.getElementById("applicationForm");
const internshipSelect = document.getElementById("internshipId");
const applicationStatus = document.getElementById("applicationStatus");
const submitButton = document.getElementById("submitApplication");

let internships = [];

function setStatus(message, type = "") {
  statusText.textContent = message;
  statusText.className = type;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderInternships(data) {
  internshipList.replaceChildren();
  if (!data.length) {
    internshipList.append(makeElement("p", "message", "No internships found. Try another search."));
    setStatus("No matching internships found.");
    return;
  }

  data.forEach((internship) => {
    const card = makeElement("article", "card");
    card.append(
      makeElement("h3", "", internship.title),
      makeElement("p", "company", internship.company || "InternBoard Partner"),
      makeElement("span", "domain", internship.domain),
      makeElement("p", "details",
        `Mode: ${internship.mode} | Location: ${internship.location} | Openings: ${internship.openings}`)
    );
    const skills = makeElement("p", "details", `Skills: ${(internship.skills || []).join(", ") || "Not specified"}`);
    const apply = makeElement("a", "apply-btn", "Apply Now");
    apply.href = "#apply";
    apply.addEventListener("click", () => { internshipSelect.value = internship.id; });
    card.append(skills, apply);
    internshipList.append(card);
  });
  setStatus(`${data.length} internship(s) found.`);
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const domain = domainSelect.value;
  const filtered = internships.filter((item) => {
    const matchesTerm = [item.title, item.domain, item.location, ...(item.skills || [])]
      .join(" ").toLowerCase().includes(term);
    return matchesTerm && (domain === "all" || item.domain === domain);
  });
  renderInternships(filtered);
}

async function loadInternships() {
  setStatus("Loading internships…");
  internshipList.replaceChildren(makeElement("p", "message", "Please wait while opportunities load."));
  try {
    const response = await fetch(`${API_BASE}/api/internships?page=1&limit=50`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const result = await response.json();
    if (!result.success || !Array.isArray(result.data)) throw new Error("Unexpected API response.");
    internships = result.data;

    const domains = [...new Set(internships.map((item) => item.domain).filter(Boolean))].sort();
    domainSelect.replaceChildren(new Option("All Domains", "all"));
    domains.forEach((domain) => domainSelect.add(new Option(domain, domain)));

    internshipSelect.replaceChildren(new Option("Select an internship", ""));
    internships.forEach((item) => internshipSelect.add(new Option(`${item.title} — ${item.domain}`, item.id)));
    applyFilters();
  } catch (error) {
    console.error("Could not load internships:", error);
    internshipList.replaceChildren(makeElement("p", "message error",
      "Unable to load internships. Check that the API server is running, then refresh."));
    setStatus("Failed to load internship data.", "error");
  }
}

searchInput.addEventListener("input", applyFilters);
domainSelect.addEventListener("change", applyFilters);
filterForm.addEventListener("reset", () => setTimeout(applyFilters, 0));

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  applicationStatus.textContent = "";
  applicationStatus.className = "";

  if (!applicationForm.reportValidity()) return;

  const payload = {
    internshipId: internshipSelect.value,
    name: document.getElementById("applicantName").value.trim(),
    email: document.getElementById("applicantEmail").value.trim(),
    phone: document.getElementById("applicantPhone").value.trim(),
    coverLetter: document.getElementById("coverLetter").value.trim()
  };

  submitButton.disabled = true;
  submitButton.textContent = "Submitting…";
  try {
    const response = await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      const message = result.errors?.join(" ") || result.message || "Application could not be submitted.";
      throw new Error(message);
    }
    applicationStatus.textContent = `Application submitted successfully. Reference: ${result.data.id}`;
    applicationStatus.className = "success";
    applicationForm.reset();
  } catch (error) {
    applicationStatus.textContent = error.message || "Network error. Please try again.";
    applicationStatus.className = "error";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Application";
  }
});

loadInternships();
