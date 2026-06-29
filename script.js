const map = L.map('map').setView([52.1, 19.4], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const places = [
  { name: "Burgerownia Miejska", city: "Warszawa", lat: 52.2297, lng: 21.0122, muala: true },
  { name: "Kebab Premium", city: "Gliwice", lat: 50.2945, lng: 18.6714, muala: true },
  { name: "Bar Mleczny Retro", city: "Kraków", lat: 50.0647, lng: 19.9450, muala: false },
  { name: "Kebab King", city: "Katowice", lat: 50.2649, lng: 19.0238, muala: true },
  { name: "Street Food Spot", city: "Wrocław", lat: 51.1079, lng: 17.0385, muala: false }
];

let markers = [];

function render(data) {

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {

    const marker = L.marker([p.lat, p.lng]).addTo(map)
      .bindPopup(`
        <b>${p.name}</b><br>
        📍 ${p.city}<br>
        ${p.muala ? "🔥 MUALA" : "OK"}
      `);

    markers.push(marker);

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <b>${p.name}</b>
      ${p.muala ? '<span class="badge">MUALA</span>' : ""}
      <br>
      <small>${p.city}</small>
    `;

    div.onclick = () => {
      map.setView([p.lat, p.lng], 13);
      marker.openPopup();
    };

    list.appendChild(div);
  });
}

/* 🔥 LEPSZE WYSZUKIWANIE (LIKE GOOGLE) */
function update() {
  const q = document.getElementById("search").value.toLowerCase();
  const onlyMuala = document.getElementById("filterMuala").checked;

  const filtered = places.filter(p => {

    const matchText =
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q);

    return matchText && (!onlyMuala || p.muala);
  });

  render(filtered);
}

document.getElementById("search").addEventListener("input", update);
document.getElementById("filterMuala").addEventListener("change", update);

render(places);
