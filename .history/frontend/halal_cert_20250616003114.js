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
    notes: document.getElementById("notes").value,
    date: new Date().toLocaleDateString()
  };

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Halal Certificate", 20, 20);
  doc.text(`Company: ${cert.company}`, 20, 30);
  doc.text(`Certifying Body: ${cert.certBody}`, 20, 40);
  doc.text(`Certificate Number: ${cert.certID}`, 20, 50);
  doc.text(`Valid Until: ${cert.validUntil}`, 20, 60);
  doc.text("Notes:", 20, 70);
  doc.text(cert.notes, 20, 80);

  const pdfBlob = doc.output("blob");
  const blobURL = URL.createObjectURL(pdfBlob);
  cert.blobURL = blobURL;

  const halalCerts = JSON.parse(localStorage.getItem("halalCerts")) || [];
  halalCerts.push(cert);
  localStorage.setItem("halalCerts", JSON.stringify(halalCerts));

  // ✅ Show success message
  document.getElementById("confirmation").innerText =
    "✅ Halal certificate submitted successfully! Redirecting to homepage...";

  // ⏳ Redirect after 3 seconds
  setTimeout(() => {
    window.location.href = "/frontend/index.html"; // adjust as needed
  }, 3000);
});
