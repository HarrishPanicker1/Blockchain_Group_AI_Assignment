// map.js
window.map = L.map('map').setView([0, 0], 2); // Whole world

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var circleMarker = L.circleMarker([0, 0], {
  radius: 5, // bigger radius = bigger circle
  color: 'blue', // stroke color
  fillColor: '#30f', // fill color
  fillOpacity: 0.6
}).addTo(map);

circleMarker.bindPopup('Company name : John Cena , industry type, click for cert details');

/* <script defer>
            var marker_ex = L.marker([0,0]).addTo(map);
            marker_ex.bindPopup('');
        </script>
*/