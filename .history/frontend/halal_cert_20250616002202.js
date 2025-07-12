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

  // Generate PDF content using jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Halal Certificate", 20, 20);
  doc.text(`Company Name: ${cert.company}`, 20, 30);
  doc.text(`Certifying Body: ${cert.certBody}`, 20, 40);
  doc.text(`Certificate Number: ${cert.certID}`, 20, 50);
  doc.text(`Valid Until: ${cert.validUntil}`, 20, 60);
  doc.text("Notes:", 20, 70);
  doc.text(cert.notes, 20, 80);

  // Convert to Blob
  const pdfBlob = doc.output("blob");
  const blobURL = URL.createObjectURL(pdfBlob);

  // Save metadata + blob URL
  const halalCerts = JSON.parse(localStorage.getItem("halalCerts")) || [];
  halalCerts.push({ ...cert, blobURL });
  localStorage.setItem("halalCerts", JSON.stringify(halalCerts));

  alert("✅ Halal Certificate saved successfully!");
// Add this at the bottom of your form submit handler:
document.getElementById("confirmation").innerText = "✅ Halal certificate submitted successfully! Redirecting to homepage...";

// Wait 3 seconds then redirect
setTimeout(() => {
  window.location.href = "/frontend/index.html"; // update this to your actual path if needed
}, 3000);

  // Redirect to home page
  window.location.href = "/frontend/index.html"; // update path if needed
});


 