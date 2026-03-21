// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

// Shop Data
const shops = [
    {
        name: "Local Tiffin Spot",
        lat: 22.574990,
        lng: 88.473696,
        items: [
            { name: "Idli Plate (3 pcs + sambar + chutney)", price: "₹40", time: "Morning Breakfast" },
            { name: "Veg Plate", price: "₹60", time: "Lunch (from 11:30 AM)" },
            { name: "Non-Veg Plate", price: "₹60", time: "Lunch (from 11:30 AM)" }
        ]
    },
];

// Get user location FIRST
navigator.geolocation.getCurrentPosition(
    function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Initialize map
        const map = L.map('map').setView([userLat, userLng], 15);

        // Load tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // User marker
        L.marker([userLat, userLng])
            .addTo(map)
            .bindPopup("📍 You are here")
            .openPopup();

        // Add shops (ONLY HERE ✅)
        shops.forEach(shop => {

            let itemsHTML = "";

            shop.items.forEach(item => {
                itemsHTML += `
                    <li>
                        ${item.name} - ${item.price}<br>
                        <small style="color:gray;">${item.time || ""}</small>
                    </li>
                `;
            });

            const popupContent = `
                <div style="font-family: Arial; min-width:180px;">
                    <h3>${shop.name}</h3>
                    <b>Menu:</b>
                    <ul>${itemsHTML}</ul>
                </div>
            `;

            const marker = L.marker([shop.lat, shop.lng]).addTo(map);

            marker.bindPopup(popupContent);

            marker.on('click', function () {
                map.setView([shop.lat, shop.lng], 17);
            });

            marker.on('mouseover', function () {
                this.openPopup();
            });
        });

    },
    function () {
        alert("Please allow location access to use this app.");
    }
);