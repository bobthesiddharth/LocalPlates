import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopDataService, Shop } from '../services/shop-data.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavBarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  shops: Shop[] = [];
  map?: L.Map;
  markers: L.Marker[] = [];
  loading = false;
  errorMessage = '';

  showForm = false;
  editingId: number | null = null;

  form = this.fb.group({
    name: [''],
    lat: [0],
    lng: [0]
  });

  constructor(private svc: ShopDataService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.reloadShops();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  reloadShops(focusId: number | null = null) {
    this.loading = true;
    this.errorMessage = '';

    this.svc.getShops().subscribe({
      next: (shops) => {
        this.shops = shops;
        this.loading = false;
        this.updateMarkers();

        if (focusId !== null) {
          this.focusShop(focusId);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Could not load shops from the backend. Make sure the Spring app is running on port 8080.';
      }
    });
  }

  initMap() {
    this.map = L.map('dashboard-map', { center: [22.575, 88.472], zoom: 14 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.updateMarkers();
  }

  updateMarkers() {
    if (!this.map) return;
    // clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];
    this.shops.forEach((s, idx) => {
      const m = L.marker([s.lat, s.lng]).addTo(this.map as L.Map).bindPopup(`<b>${s.name}</b>`);
      this.markers.push(m);
    });
    // adjust viewport to show all markers when possible
    this.adjustMapView();
  }

  toggleCreate() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingId = null;
      this.form.reset({ name: '', lat: 22.575, lng: 88.472 });
    }
  }

  startEdit(shop: Shop) {
    this.editingId = shop.id ?? null;
    this.showForm = true;
    this.form.setValue({ name: shop.name, lat: shop.lat, lng: shop.lng });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const shop: Shop = {
      id: this.editingId ?? undefined,
      name: String(val.name ?? '').trim(),
      lat: Number(val.lat),
      lng: Number(val.lng),
      items: []
    };

    if (this.editingId == null) {
      this.svc.createShop(shop).subscribe({
        next: (created) => {
          this.toggleCreate();
          this.reloadShops(created.id ?? null);
        },
        error: () => {
          this.errorMessage = 'Could not create shop. Check the backend API.';
        }
      });
      return;
    }

    this.svc.updateShop(this.editingId, shop).subscribe({
      next: (updated) => {
        this.toggleCreate();
        this.reloadShops(updated.id ?? null);
      },
      error: () => {
        this.errorMessage = 'Could not update shop. Check the backend API.';
      }
    });
  }

  remove(shop: Shop) {
    if (shop.id == null) return;
    if (!confirm('Delete this shop?')) return;
    this.svc.deleteShop(shop.id).subscribe({
      next: () => {
        this.reloadShops();
      },
      error: () => {
        this.errorMessage = 'Could not delete shop. Check the backend API.';
      }
    });
  }

  // center map on a marker and open its popup
  private focusShop(id: number) {
    if (!this.map) return;
    const index = this.shops.findIndex((shop) => shop.id === id);
    if (index < 0) return;

    const m = this.markers[index];
    if (!m) return;
    const latlng = (m.getLatLng && m.getLatLng()) as L.LatLng | null;
    if (latlng) {
      this.map.setView(latlng, Math.max(this.map.getZoom(), 15));
      m.openPopup();
    }
  }

  // fit map to all markers or center to default
  private adjustMapView() {
    if (!this.map) return;
    if (this.markers.length === 0) return;
    const group = L.featureGroup(this.markers as any);
    try {
      this.map.fitBounds(group.getBounds().pad(0.2));
    } catch (e) {
      // fallback: center on first marker
      const m = this.markers[0];
      const latlng = (m.getLatLng && m.getLatLng()) as L.LatLng | null;
      if (latlng) this.map.setView(latlng, 14);
    }
  }
}

