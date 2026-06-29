// Start mapy (Polska)
const map = L.map('map').setView([52.0693, 19.4803], 6);

// mapa z OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// przykładowe restauracje
const restaurants = [
  {
    name: "Test Burger",
    city: "Warszawa",
    lat: 52.2297,
    lng: 21.0122,
    muala: true
  },
  {
    name: "Kebab MUALA",
    city: "Gliwice",
    lat: 50.2945,
    lng: 18.6714,
    muala: true
  }
];

// dodawanie pinezek
restaurants.forEach(r => {
  L.marker([r.lat, r.lng])
    .addTo(map)
    .bindPopup(`
      <b>${r.name}</b><br>
      📍 ${r.city}<br>
      ⭐ ${r.muala ? "MUALA" : ""}
    `);
});
