// Simulated localStorage company list for now
let companies = JSON.parse(localStorage.getItem("companies")) || [];

// Populate company dropdown
const companyDropdown = document.getElementById("company");
companies.forEach(c => {
  const option = document.createElement("option");
  option.value = c.name;
  option.textContent = c.name;
  companyDropdown.appendChild(option);
});

// Handle submission
document.getElementById("halalForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cert = {
    company: document.getElementById("company").value,
    certBody: document.getElementById("certBody").value,
    certID: document.getElementById("certID").value,
    validUntil: document.getElementById("validUntil").value,
    notes: document.getElementById("notes").value
  };

  let halalCerts = JSON.parse(localStorage.getItem("halalCerts")) || [];
  halalCerts.push(cert);
  localStorage.setItem("halalCerts", JSON.stringify(halalCerts));

  alert("✅ Halal Certificate saved for " + cert.company);
  window.location.href = "index.html"; // 👈 change this to your actual homepage file if needed
});


