// Static shop data (you can edit locations)
const shops = [
  {
    name: "Ravi Chapati Stall",
    lat: 22.5726,   // change to your area
    lng: 88.3639,
    price: "₹6 Chapati",
    desc: "Fresh handmade chapati"
  },
  {
    name: "Anand Tiffin",
    lat: 22.5735,
    lng: 88.3625,
    price: "₹30 Meal",
    desc: "Budget South Indian meals"
  },
  {
    name: "Street Dosa Cart",
    lat: 22.5742,
    lng: 88.3650,
    price: "₹20 Dosa",
    desc: "Evening dosa cart"
  }
];

// Get user location
navigator.geolocation.getCurrentPosition(
  function (position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    // Initialize map
    const map = L.map('map').setView([userLat, userLng], 15);

    // Load map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add user marker
    L.marker([userLat, userLng])
      .addTo(map)
      .bindPopup("📍 You are here")
      .openPopup();

    // Add shop markers
    shops.forEach(shop => {
      L.marker([shop.lat, shop.lng])
        .addTo(map)
        .bindPopup(`
          <b>${shop.name}</b><br>
          ${shop.price}<br>
          ${shop.desc}
        `);
    });

  },
  function () {
    alert("Location access denied. Please allow location.");
  }
);