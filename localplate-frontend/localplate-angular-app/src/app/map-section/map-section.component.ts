import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopDataService, Shop } from '../services/shop-data.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-section.component.html',
  styleUrl: './map-section.component.css'
})
export class MapSectionComponent implements OnInit {
  @ViewChild('mapDiv', { static: false }) mapDiv!: ElementRef;

  map: L.Map | null = null;
  shops: Shop[] = [];
  shopMarkers: L.Marker[] = [];
  userLocation: { lat: number; lng: number } | null = null;

  constructor(private shopDataService: ShopDataService) {}

  ngOnInit(): void {
    this.loadShops();
    this.getUserLocation();
  }

  loadShops(): void {
    this.shopDataService.getShops().subscribe({
      next: (shops) => {
        this.shops = shops;
        this.renderShopMarkers();
      },
      error: () => {
        alert('Could not load shops from the backend. Please make sure the Spring API is running on port 8080.');
      }
    });
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.userLocation = { lat, lng };
          this.initializeMap(lat, lng);
        },
        () => {
          alert('Please allow location access to use this app.');
          // Fallback location (Kolkata)
          this.initializeMap(22.5726, 88.3639);
        }
      );
    }
  }

  initializeMap(lat: number, lng: number): void {
    if (!this.mapDiv) return;

    // Fix Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png'
    });

    // Initialize map
    this.map = L.map(this.mapDiv.nativeElement).setView([lat, lng], 15);

    // Load tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // User marker
    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup('📍 You are here')
      .openPopup();

    // Add shop markers
    this.renderShopMarkers();
  }

  renderShopMarkers(): void {
    if (!this.map) return;

    this.shopMarkers.forEach((marker) => marker.remove());
    this.shopMarkers = [];

    this.shops.forEach((shop, shopIndex) => {
      const marker = L.marker([shop.lat, shop.lng]).addTo(this.map!);

      const popupContent = this.createPopupContent(shop, shopIndex);
      marker.bindPopup(L.popup().setContent(popupContent));

      marker.on('click', () => {
        if (this.map) {
          this.map.setView([shop.lat, shop.lng], 17);
        }
      });

      marker.on('mouseover', () => {
        marker.openPopup();
      });

      this.shopMarkers.push(marker);
    });
  }

  createPopupContent(shop: Shop, shopIndex: number): HTMLElement {
    const container = document.createElement('div');
    container.className = 'custom-popup-content';

    const title = document.createElement('h3');
    title.className = 'shop-name';
    title.innerText = shop.name;
    container.appendChild(title);

    // Directions button
    const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`;
    const dirBtn = document.createElement('a');
    dirBtn.href = directionUrl;
    dirBtn.target = '_blank';
    dirBtn.className = 'btn-navigate';
    dirBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
      Get Directions
    `;
    container.appendChild(dirBtn);

    // Menu label
    const menuLabel = document.createElement('div');
    menuLabel.className = 'menu-label';
    menuLabel.style.marginTop = '20px';
    menuLabel.innerText = 'Menu';
    container.appendChild(menuLabel);

    // Menu items
    const menuList = document.createElement('div');
    menuList.className = 'menu-list';

    shop.items.forEach((item, itemIndex) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';

      const itemHeader = document.createElement('div');
      itemHeader.className = 'item-header';

      const itemName = document.createElement('span');
      itemName.className = 'item-name';
      itemName.innerText = item.name;
      itemHeader.appendChild(itemName);

      if (item.price === 'Price updating soon') {
        const priceWrapper = document.createElement('span');
        priceWrapper.className = 'item-price-wrapper';

        const price = document.createElement('span');
        price.className = 'item-price pending-price';
        price.id = `price-${shopIndex}-${itemIndex}`;
        price.innerText = item.price;

        const updateBtn = document.createElement('button');
        updateBtn.className = 'btn-update-price';
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.updatePrice(shop, itemIndex, price);

        priceWrapper.appendChild(price);
        priceWrapper.appendChild(updateBtn);
        itemHeader.appendChild(priceWrapper);
      } else {
        const price = document.createElement('span');
        price.className = 'item-price';
        price.id = `price-${shopIndex}-${itemIndex}`;
        price.innerText = item.price;
        itemHeader.appendChild(price);
      }

      menuItem.appendChild(itemHeader);

      const itemTime = document.createElement('div');
      itemTime.className = 'item-time';
      itemTime.innerText = item.time || '';
      menuItem.appendChild(itemTime);

      menuList.appendChild(menuItem);
    });

    container.appendChild(menuList);
    return container;
  }

  updatePrice(shop: Shop, itemIndex: number, priceElement: HTMLElement): void {
    if (shop.id == null) return;

    const newPrice = prompt('Enter the new price (e.g., ₹30):');
    if (newPrice && newPrice.trim() !== '') {
      this.shopDataService.updateShopItemPrice(shop.id, itemIndex, newPrice.trim()).subscribe({
        next: (updatedShop) => {
          this.shops = this.shops.map((existingShop) =>
            existingShop.id === updatedShop.id ? updatedShop : existingShop
          );

          priceElement.innerText = newPrice.trim();
          priceElement.classList.remove('pending-price');

          const btn = priceElement.nextElementSibling;
          if (btn && btn.classList.contains('btn-update-price')) {
            btn.remove();
          }

          this.renderShopMarkers();

          const focusId = updatedShop.id ?? shop.id;
          if (focusId != null) {
            this.focusShop(focusId);
          }
        },
        error: () => {
          alert('Could not update the price in the backend.');
        }
      });
    }
  }

  private focusShop(shopId: number): void {
    if (!this.map) return;

    const index = this.shops.findIndex((shop) => shop.id === shopId);
    if (index < 0) return;

    const marker = this.shopMarkers[index];
    if (!marker) return;

    const latlng = (marker.getLatLng && marker.getLatLng()) as L.LatLng | null;
    if (latlng) {
      this.map.setView(latlng, 17);
      marker.openPopup();
    }
  }
}
