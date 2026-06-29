const map = L.map('map').setView([52.1, 19.4], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

/* =========================
   DANE
========================= */
const places = [
  { name: "Burgerownia Miejska", city: "Warszawa", lat: 52.2297, lng: 21.0122, muala: true },
  { name: "Kebab Premium", city: "Gliwice", lat: 50.2945, lng: 18.6714, muala: true },
  { name: "Bar Mleczny Retro", city: "Kraków", lat: 50.0647, lng: 19.9450, muala: false },
  { name: "Kebab King", city: "Katowice", lat: 50.2649, lng: 19.0238, muala: true },
];

/* =========================
   STATE
========================= */
let markers = [];
let currentFilter = "all";

/* =========================
   RENDER MAP + LIST
========================= */
function render(data) {

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {

    const marker = L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`
        <b>${p.name}</b><br>
        📍 ${p.city}<br>
        ${p.muala ? "🔥 MUALA" : "OK"}
      `);

    markers.push(marker);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="name">
        ${p.name}
        ${p.muala ? '<span class="badge">MUALA</span>' : ''}
      </div>
      <div class="city">${p.city}</div>
    `;

    card.onclick = () => {
      map.flyTo([p.lat, p.lng], 14);
      marker.openPopup();
    };

    list.appendChild(card);
  });
}

/* =========================
   SEARCH (REAL)
========================= */
function update() {
  const q = document.getElementById("search").value.toLowerCase();

  let filtered = places.filter(p => {
    const text = (p.name + " " + p.city).toLowerCase();
    const match = text.includes(q);

    if (currentFilter === "muala") {
      return match && p.muala;
    }

    return match;
  });

  render(filtered);
}

/* =========================
   FILTER BUTTONS
========================= */
document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    update();
  });
});

document.getElementById("search").addEventListener("input", update);

/* START */
render(places);
