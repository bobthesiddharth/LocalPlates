import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';

export interface MenuItem {
  name: string;
  price: string;
  time: string;
}

export interface Shop {
  id?: number;
  name: string;
  lat: number;
  lng: number;
  items: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ShopDataService {
  private readonly baseUrl = 'http://localhost:8080/api/shops';

  constructor(private http: HttpClient) {}

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.baseUrl);
  }

  getShop(id: number): Observable<Shop> {
    return this.http.get<Shop>(`${this.baseUrl}/${id}`);
  }

  createShop(shop: Shop): Observable<Shop> {
    return this.http.post<Shop>(this.baseUrl, this.normalizeShop(shop));
  }

  updateShop(id: number, shop: Shop): Observable<Shop> {
    return this.http.put<Shop>(`${this.baseUrl}/${id}`, this.normalizeShop(shop));
  }

  deleteShop(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateShopItemPrice(shopId: number, itemIndex: number, newPrice: string): Observable<Shop> {
    return this.getShop(shopId).pipe(
      switchMap((shop) => {
        const items = [...(shop.items ?? [])];

        if (!items[itemIndex]) {
          return throwError(() => new Error('Menu item not found'));
        }

        items[itemIndex] = {
          ...items[itemIndex],
          price: newPrice
        };

        return this.updateShop(shopId, {
          ...shop,
          items
        });
      })
    );
  }

  private normalizeShop(shop: Shop): Shop {
    return {
      ...shop,
      items: Array.isArray(shop.items) ? shop.items : []
    };
  }
}

