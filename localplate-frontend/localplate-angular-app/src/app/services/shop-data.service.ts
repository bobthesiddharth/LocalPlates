import { Injectable } from '@angular/core';

export interface MenuItem {
  name: string;
  price: string;
  time: string;
}

export interface Shop {
  name: string;
  lat: number;
  lng: number;
  items: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ShopDataService {
  shops: Shop[] = [
    {
      name: 'Local Tiffin Spot',
      lat: 22.574990,
      lng: 88.473696,
      items: [
        { name: 'Idli Plate (3 pcs + sambar + chutney)', price: '₹40', time: 'Morning Breakfast' },
        { name: 'Veg Plate', price: '₹60', time: 'Lunch (from 11:30 AM)' },
        { name: 'Non-Veg Plate', price: '₹60', time: 'Lunch (from 11:30 AM)' },
        { name: 'Roti', price: '₹6', time: 'Dinner' },
        { name: 'Chicken', price: '₹60', time: 'Dinner' },
        { name: 'Full Tarka / Chana / Ghuguni / Matar', price: '₹40', time: 'Dinner' },
        { name: 'Half Plate (Tarka/Chana/etc)', price: '₹25', time: 'Dinner' }
      ]
    },
    {
      name: 'Roti Tadka Chana Point',
      lat: 22.576591,
      lng: 88.474049,
      items: [
        { name: 'Roti', price: '₹7', time: 'Dinner' },
        { name: 'Tadka Half', price: '₹20', time: 'Dinner' },
        { name: 'Tadka Full', price: '₹40', time: 'Dinner' },
        { name: 'Chana Half', price: '₹25', time: 'Dinner' },
        { name: 'Chana Full', price: '₹40', time: 'Dinner' },
        { name: 'Mudhi (Puffed Rice)', price: '₹20', time: 'Dinner' },
        { name: 'Ghugni with Mudhi', price: '₹20', time: 'Dinner' }
      ]
    },
    {
      name: 'Evening Roti Point',
      lat: 22.576667,
      lng: 88.471556,
      items: [
        { name: 'Roti', price: '₹6', time: 'Dinner' },
        { name: 'Veg (Matar / Chana / Mix Veg) - Half', price: '₹20', time: 'Dinner' },
        { name: 'Veg (Matar / Chana / Mix Veg) - Full', price: '₹30', time: 'Dinner' },
        { name: 'Chicken (Non-Veg)', price: '₹60', time: 'Dinner' }
      ]
    },
    {
      name: 'Night Roti & Ghuguni Stall',
      lat: 22.575897,
      lng: 88.471341,
      items: [
        { name: 'Roti', price: '₹6', time: 'Dinner' },
        { name: 'Ghuguni', price: 'Price updating soon', time: 'Dinner' }
      ]
    },
    {
      name: 'Morning Luchi Chole Stall',
      lat: 22.578139,
      lng: 88.458194,
      items: [
        { name: 'Luchi / Puri', price: '₹40 (total avg)', time: 'Morning' },
        { name: 'Chana / Chole Masala', price: '₹40 (total avg)', time: 'Morning' },
        { name: 'Egg Curry', price: '₹40 (total avg)', time: 'Morning' }
      ]
    },
    {
      name: 'Luchi & Street Food Corner',
      lat: 22.577419,
      lng: 88.471752,
      items: [
        { name: 'Luchi / Puri with Sabji', price: '₹40', time: 'Morning' },
        { name: 'Mudi (Puffed Rice)', price: '₹20', time: 'Morning' },
        { name: 'Momo', price: '₹60', time: 'Night' },
        { name: 'Sahi Tukda (1 piece)', price: '₹55', time: 'Night' },
        { name: 'Egg Roll', price: '₹45', time: 'Night' },
        { name: 'Chicken Kabab', price: 'Price updating soon', time: 'Night' }
      ]
    },
    {
      name: 'Budget Lunch Meal Point',
      lat: 22.574723,
      lng: 88.474097,
      items: [
        { name: 'Veg Meal', price: '₹60', time: 'Lunch' },
        { name: 'Fish Meal (Non-Veg)', price: '₹80', time: 'Lunch' },
        { name: 'Chicken Meal (Non-Veg)', price: '₹90', time: 'Lunch' }
      ]
    }
  ];

  constructor() {}

  getShops(): Shop[] {
    return this.shops;
  }

  updateShopItemPrice(shopIndex: number, itemIndex: number, newPrice: string): void {
    if (this.shops[shopIndex] && this.shops[shopIndex].items[itemIndex]) {
      this.shops[shopIndex].items[itemIndex].price = newPrice;
    }
  }
}

