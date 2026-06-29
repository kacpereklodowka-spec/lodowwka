const map = L.map('map').setView([52.1, 19.4], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

/* =====================
   DATA MODEL (SCALE READY)
===================== */
const places = [
  {
    id: 1,
    name: "Burgerownia Miejska",
    city: "Warszawa",
    lat: 52.2297,
    lng: 21.0122,
    muala: true,
    desc: "Bardzo dobry burger",
    comments: []
  },
  {
    id: 2,
    name: "Kebab Premium",
    city: "Gliwice",
    lat: 50.2945,
    lng: 18.6714,
    muala: true,
    desc: "Top kebab",
    comments: []
  }
];

let markers = [];
let currentFilter = "all";
let selectedPlace = null;

/* =====================
   RENDER MAP + LIST
===================== */
function render(data) {

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {

    const marker = L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(p.name);

    markers.push(marker);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <b>${p.name}</b>
      ${p.muala ? '<span class="badge">MUALA</span>' : ''}
      <br>
      <small>${p.city}</small>
    `;

    card.onclick = () => showDetails(p);

    list.appendChild(card);
  });
}

/* =====================
   DETAILS PANEL (LIKE GOOGLE MAPS)
===================== */
function showDetails(place) {
  selectedPlace = place;

  document.getElementById("details").classList.remove("hidden");

  document.getElementById("detailsContent").innerHTML = `
    <h3>${place.name}</h3>
    <p>📍 ${place.city}</p>
    <p>${place.desc}</p>

    <h4>Komentarze</h4>

    <div id="comments">
      ${(place.comments || []).map(c => `<p>💬 ${c}</p>`).join("")}
    </div>

    <input id="commentInput" placeholder="Dodaj komentarz..." />
    <button onclick="addComment()">Dodaj</button>
  `;

  map.flyTo([place.lat, place.lng], 14);
}

/* =====================
   COMMENTS (LOCAL STORAGE STYLE)
===================== */
function addComment() {
  const input = document.getElementById("commentInput");
  const text = input.value;

  if (!text || !selectedPlace) return;

  selectedPlace.comments.push(text);
  input.value = "";

  showDetails(selectedPlace);
}

/* =====================
   SEARCH ENGINE PRO
===================== */
function update() {
  const q = document.getElementById("search").value.toLowerCase();

  let filtered = places.filter(p => {
    const text = (p.name + p.city + p.desc).toLowerCase();
    const match = text.includes(q);

    if (currentFilter === "muala") {
      return match && p.muala;
    }

    return match;
  });

  render(filtered);
}

/* =====================
   FILTERS
===================== */
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
