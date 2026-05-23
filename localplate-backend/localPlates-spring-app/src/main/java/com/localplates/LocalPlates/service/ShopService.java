package com.localplates.LocalPlates.service;

import com.localplates.LocalPlates.model.MenuItem;
import com.localplates.LocalPlates.model.Shop;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ShopService {
    private final Map<Long, Shop> shops = new ConcurrentHashMap<>();
    private final AtomicLong idGen = new AtomicLong(1);

    @PostConstruct
    public void init() {
        // seed with a couple of shops for testing
        List<MenuItem> items1 = new ArrayList<>();
        items1.add(new MenuItem("Idli Plate (3 pcs + sambar + chutney)", "₹40", "Morning Breakfast"));
        items1.add(new MenuItem("Veg Plate", "₹60", "Lunch (from 11:30 AM)"));
        Shop s1 = new Shop(nextId(), "Local Tiffin Spot", 22.574990, 88.473696, items1);
        shops.put(s1.getId(), s1);

        List<MenuItem> items2 = new ArrayList<>();
        items2.add(new MenuItem("Roti", "₹7", "Dinner"));
        items2.add(new MenuItem("Tadka Full", "₹40", "Dinner"));
        Shop s2 = new Shop(nextId(), "Roti Tadka Chana Point", 22.576591, 88.474049, items2);
        shops.put(s2.getId(), s2);
    }

    private long nextId() { return idGen.getAndIncrement(); }

    public List<Shop> findAll() {
        return new ArrayList<>(shops.values());
    }

    public Shop findById(Long id) {
        return shops.get(id);
    }

    public Shop create(Shop shop) {
        long id = nextId();
        shop.setId(id);
        if (shop.getItems() == null) shop.setItems(new ArrayList<>());
        shops.put(id, shop);
        return shop;
    }

    public Shop update(Long id, Shop shop) {
        Shop existing = shops.get(id);
        if (existing == null) return null;
        existing.setName(shop.getName());
        existing.setLat(shop.getLat());
        existing.setLng(shop.getLng());
        existing.setItems(shop.getItems() == null ? new ArrayList<>() : shop.getItems());
        shops.put(id, existing);
        return existing;
    }

    public boolean delete(Long id) {
        return shops.remove(id) != null;
    }
}

