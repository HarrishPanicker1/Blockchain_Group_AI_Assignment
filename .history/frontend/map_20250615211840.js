// map.js
window.map = L.map('map').setView([0, 0], 2); // Whole world

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var circleMarker = L.circleMarker([0, 0], {
  radius: 1.5,
  color: 'Red',
  fillColor: '#30f',
  fillOpacity: 0.6
}).addTo(map);

circleMarker.bindPopup('Company name : John Cena , industry type, click for cert details');

// ✅ Add this block at the end
window.addEventListener("DOMContentLoaded", () => {
  const markerData = localStorage.getItem("newCompanyMarker");
  if (markerData) {
    const { lat, lng, name, type } = JSON.parse(markerData);
    const marker = L.circleMarker([lat, lng], {
        radius: 1.5,
        color: 'Red',
        fillColor: '#30f',
        fillOpacity: 0.6
    }).addTo(map);
    marker.bindPopup(`Company name: ${name}, Industry type: ${type}`);
    localStorage.removeItem("newCompanyMarker");
  }
});
