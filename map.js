// map.js
let map;
let companies = [];

// Initialize the map
function initMap() {
  // Create map centered on Malaysia
  map = L.map('map').setView([4.2105, 101.9758], 6);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  // Load companies from blockchain or local storage
  loadCompanies();
}

// Load companies and display them on map
async function loadCompanies() {
  try {
    // Try to load from blockchain if available
    if (window.ethereum) {
      await loadFromBlockchain();
    }

    // Also load halal certificates
    loadHalalCertificates();
  } catch (error) {
    console.error('Error loading companies:', error);
    // Fallback to demo data
    loadDemoData();
  }
}

// Load companies from blockchain
async function loadFromBlockchain() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const response = await fetch('./CompanyRegistry/CompanyRegistry.json');
    const artifact = await response.json();

    // You would need the deployed contract address here
    // For demo purposes, we'll use sample data
    loadDemoData();
  } catch (error) {
    console.error('Blockchain loading failed:', error);
    loadDemoData();
  }
}

// Load demo data for demonstration
function loadDemoData() {
  const demoCompanies = [
    {
      id: 1,
      name: 'Halal Food Processor Sdn Bhd',
      type: 'Food Processing',
      location: '3.1390,101.6869', // Kuala Lumpur
      description: 'Leading halal food processor in Malaysia',
      certified: true,
    },
    {
      id: 2,
      name: 'Islamic Meat Supply',
      type: 'Meat Supplier',
      location: '5.4164,100.3327', // Penang
      description: 'Certified halal meat supplier',
      certified: true,
    },
    {
      id: 3,
      name: 'Halal Logistics Hub',
      type: 'Logistics',
      location: '1.4927,103.7414', // Johor Bahru
      description: 'Specialized halal transportation and storage',
      certified: false,
    },
  ];

  companies = demoCompanies;
  displayCompaniesOnMap();
}

// Display companies on map
function displayCompaniesOnMap() {
  companies.forEach(company => {
    const [lat, lng] = company.location.split(',').map(Number);

    // Choose marker color based on certification status
    const markerColor = company.certified ? 'green' : 'red';

    // Create custom icon
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
                background-color: ${markerColor};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Create marker
    const marker = L.marker([lat, lng], { icon }).addTo(map);

    // Create popup content
    const popupContent = `
            <div style="min-width: 200px;">
                <h3>${company.name}</h3>
                <p><strong>Type:</strong> ${company.type}</p>
                <p><strong>Description:</strong> ${company.description}</p>
                <p><strong>Halal Certified:</strong> 
                    <span style="color: ${
                      company.certified ? 'green' : 'red'
                    };">
                        ${company.certified ? '✓ Yes' : '✗ No'}
                    </span>
                </p>
                <button onclick="viewDetails(${company.id})" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    margin-top: 10px;
                ">View Details</button>
            </div>
        `;

    marker.bindPopup(popupContent);

    // Add hover effect
    marker.on('mouseover', function () {
      this.openPopup();
    });
  });
}

// Load halal certificates and display them
function loadHalalCertificates() {
  const halalCerts = JSON.parse(localStorage.getItem('halalCerts')) || [];

  halalCerts.forEach((cert, index) => {
    // Add certificate markers (you can customize locations)
    const certLocations = [
      [3.139, 101.6869], // KL
      [5.4164, 100.3327], // Penang
      [1.4927, 103.7414], // JB
    ];

    if (certLocations[index]) {
      const [lat, lng] = certLocations[index];

      const certIcon = L.divIcon({
        className: 'cert-marker',
        html: `<div style="
                    background-color: gold;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: black;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">H</div>`,
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5],
      });

      const certMarker = L.marker([lat, lng], { icon: certIcon }).addTo(map);

      const certPopup = `
                <div style="min-width: 200px;">
                    <h3>📜 Halal Certificate</h3>
                    <p><strong>Company:</strong> ${cert.company}</p>
                    <p><strong>Cert Body:</strong> ${cert.certBody}</p>
                    <p><strong>Cert ID:</strong> ${cert.certID}</p>
                    <p><strong>Valid Until:</strong> ${cert.validUntil}</p>
                    <a href="${cert.blobURL}" target="_blank" download="certificate.pdf" style="
                        background: #28a745;
                        color: white;
                        padding: 5px 10px;
                        text-decoration: none;
                        border-radius: 3px;
                        display: inline-block;
                        margin-top: 10px;
                    ">📄 Download Certificate</a>
                </div>
            `;

      certMarker.bindPopup(certPopup);
    }
  });
}

// View company details function
function viewDetails(companyId) {
  const company = companies.find(c => c.id === companyId);
  if (company) {
    alert(
      `Detailed view for ${company.name}\n\nThis would typically open a detailed page with supply chain tracking, certification history, and more information.`
    );
  }
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);
