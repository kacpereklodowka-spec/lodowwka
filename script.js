const map = L.map('map', {
  zoomControl: true
}).setView([52.1, 19.4], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// 🔥 LEVEL 2 DATA MODEL
const places = [
  {
    name: "Burgerownia Miejska",
    city: "Warszawa",
    lat: 52.2297,
    lng: 21.0122,
    rating: "MUALA",
    desc: "Bardzo dobry burger, polecany w odcinku",
  },
  {
    name: "Kebab Premium",
    city: "Gliwice",
    lat: 50.2945,
    lng: 18.6714,
    rating: "MUALA",
    desc: "Jeden z lepszych kebabów w regionie",
  },
  {
    name: "Bar Mleczny Retro",
    city: "Kraków",
    lat: 50.0647,
    lng: 19.9450,
    rating: "OK",
    desc: "Klasyczny bar mleczny",
  },
  {
    name: "Street Kebab King",
    city: "Katowice",
    lat: 50.2649,
    lng: 19.0238,
    rating: "MUALA",
    desc: "Tani i duży kebab",
  }
];

let markers = [];

/* =======================
   RENDER APP
======================= */
function render(data) {

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {

    // 🔥 custom icon
    const icon = L.divIcon({
      className: "",
      html: `<div style="
        font-size:22px;
        filter: drop-shadow(0 0 3px black);
      ">🍔</div>`
    });

    const marker = L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .bindPopup(`
        <b>${p.name}</b><br>
        📍 ${p.city}<br>
        ⭐ ${p.rating}<br>
        <small>${p.desc}</small>
      `);

    markers.push(marker);

    // 🧱 CARD UI
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <b>${p.name}</b>
      <span class="badge">${p.rating}</span>
      <br>
      <small>${p.city}</small>
      <br>
      <small style="color:#aaa">${p.desc}</small>
    `;

    div.onclick = () => {
      map.flyTo([p.lat, p.lng], 14, {
        duration: 1
      });
      marker.openPopup();
    };

    list.appendChild(div);
  });
}

/* =======================
   SEARCH ENGINE v2
======================= */
function update() {
  const q = document.getElementById("search").value.toLowerCase();
  const onlyMuala = document.getElementById("filterMuala").checked;

  const filtered = places.filter(p => {

    const text = (
      p.name + " " +
      p.city + " " +
      p.rating + " " +
      p.desc
    ).toLowerCase();

    const match = text.includes(q);

    return match && (!onlyMuala || p.rating === "MUALA");
  });

  render(filtered);
}

document.getElementById("search").addEventListener("input", update);
document.getElementById("filterMuala").addEventListener("change", update);

// START
render(places);
