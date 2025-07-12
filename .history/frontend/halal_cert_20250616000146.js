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
document.getElementById("halalForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const cert = {
    company: document.getElementById("company").value,
    certBody: document.getElementById("certBody").value,
    certID: document.getElementById("certID").value,
    validUntil: document.getElementById("validUntil").value,
    notes: document.getElementById("notes").value,
    date: new Date().toISOString()
  };

  // Generate PDF
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

  const filename = `Halal_Certificate_${cert.company}_${Date.now()}.pdf`;
  doc.save(filename);

  // Save metadata to localStorage
  let halalCerts = JSON.parse(localStorage.getItem("halalCerts")) || [];
  halalCerts.push({ ...cert, filename });
  localStorage.setItem("halalCerts", JSON.stringify(halalCerts));

  // Redirect back to homepage
  window.location.href = "/frontend/index.html"; // <-- update path if needed
});
<script>
  window.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("pdfList");
    const halalCerts = JSON.parse(localStorage.getItem("halalCerts")) || [];

    halalCerts.forEach(cert => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${cert.company}</strong> – ${cert.certID}
        <a href="#" onclick="downloadPDF('${cert.filename}')">Download PDF</a>
      `;
      list.appendChild(li);
    });
  });

  function downloadPDF(filename) {
    alert("📄 PDF was generated on submission and saved locally. Please check your Downloads folder.");
  }
</script>


