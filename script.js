// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});

// Shop Data
const shops = [
    {
        name: "Local Tiffin Spot",
        lat: 22.574990,
        lng: 88.473696,
        items: [
            // 🌅 Breakfast
            {
                name: "Idli Plate (3 pcs + sambar + chutney)",
                price: "₹40",
                time: "Morning Breakfast"
            },

            // 🍛 Lunch
            {
                name: "Veg Plate",
                price: "₹60",
                time: "Lunch (from 11:30 AM)"
            },
            {
                name: "Non-Veg Plate",
                price: "₹60",
                time: "Lunch (from 11:30 AM)"
            },

            // 🌙 Dinner
            {
                name: "Roti",
                price: "₹6",
                time: "Dinner"
            },
            {
                name: "Chicken",
                price: "₹60",
                time: "Dinner"
            },
            {
                name: "Full Tarka / Chana / Ghuguni / Matar",
                price: "₹40",
                time: "Dinner"
            },
            {
                name: "Half Plate (Tarka/Chana/etc)",
                price: "₹25",
                time: "Dinner"
            }
        ]
    },
    {
        name: "Roti Tadka Chana Point",
        lat: 22.576591,
        lng: 88.474049,
        items: [
            { name: "Roti", price: "₹7", time: "Dinner" },

            { name: "Tadka Half", price: "₹20", time: "Dinner" },
            { name: "Tadka Full", price: "₹40", time: "Dinner" },

            { name: "Chana Half", price: "₹25", time: "Dinner" },
            { name: "Chana Full", price: "₹40", time: "Dinner" },

            { name: "Mudhi (Puffed Rice)", price: "₹20", time: "Dinner" },
            { name: "Ghugni with Mudhi", price: "₹20", time: "Dinner" }
        ]
    },
    {
        name: "Evening Roti Point",
        lat: 22.576667,
        lng: 88.471556,
        items: [
            { name: "Roti", price: "₹6", time: "Dinner" },

            { name: "Veg (Matar / Chana / Mix Veg) - Half", price: "₹20", time: "Dinner" },
            { name: "Veg (Matar / Chana / Mix Veg) - Full", price: "₹30", time: "Dinner" },

            { name: "Chicken (Non-Veg)", price: "₹60", time: "Dinner" }
        ]
    },
    {
        name: "Night Roti & Ghuguni Stall",
        lat: 22.575897,
        lng: 88.471341,
        items: [
            { name: "Roti", price: "₹6", time: "Dinner" },
            { name: "Ghuguni", price: "Price updating soon", time: "Dinner" }
        ]
    },
];

// Global update price function for handling inline price edits
window.updatePrice = function(shopIndex, itemIndex) {
    const newPrice = prompt("Enter the new price (e.g., ₹30):");
    if (newPrice && newPrice.trim() !== "") {
        // Update local object
        shops[shopIndex].items[itemIndex].price = newPrice;
        // Update DOM instantly
        const priceElement = document.getElementById(`price-${shopIndex}-${itemIndex}`);
        if (priceElement) {
            priceElement.innerHTML = newPrice;
            priceElement.classList.remove('pending-price');
            const btn = priceElement.nextElementSibling;
            if (btn && btn.classList.contains('btn-update-price')) {
                btn.remove();
            }
        }
    }
};

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
        shops.forEach((shop, shopIndex) => {

            let itemsHTML = "";

            shop.items.forEach((item, itemIndex) => {
                let priceDisplay = `<span class="item-price" id="price-${shopIndex}-${itemIndex}">${item.price}</span>`;
                
                if (item.price === "Price updating soon") {
                    priceDisplay = `
                        <span class="item-price-wrapper">
                            <span class="item-price pending-price" id="price-${shopIndex}-${itemIndex}">${item.price}</span>
                            <button class="btn-update-price" onclick="updatePrice(${shopIndex}, ${itemIndex})">Update</button>
                        </span>
                    `;
                }

                itemsHTML += `
                    <div class="menu-item">
                        <div class="item-header">
                            <span class="item-name">${item.name}</span>
                            ${priceDisplay}
                        </div>
                        <div class="item-time">${item.time || ""}</div>
                    </div>
                `;
            });

            // Google Maps URL including destination coordinates
            const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`;

            const popupContent = `
                <div class="custom-popup-content">
                    <h3 class="shop-name">${shop.name}</h3>
                    <a href="${directionUrl}" target="_blank" class="btn-navigate">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        Get Directions
                    </a>
                    <div class="menu-label" style="margin-top: 20px;">Menu</div>
                    <div class="menu-list">${itemsHTML}</div>
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

// Back to Top functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});