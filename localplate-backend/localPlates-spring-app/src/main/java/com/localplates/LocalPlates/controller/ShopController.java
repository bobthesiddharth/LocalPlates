package com.localplates.LocalPlates.controller;

import com.localplates.LocalPlates.model.Shop;
import com.localplates.LocalPlates.service.ShopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin(origins = "*")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping
    public List<Shop> list() {
        return shopService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shop> get(@PathVariable Long id) {
        Shop s = shopService.findById(id);
        return s == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(s);
    }

    @PostMapping
    public ResponseEntity<Shop> create(@RequestBody Shop shop) {
        Shop created = shopService.create(shop);
        return ResponseEntity.created(URI.create("/api/shops/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shop> update(@PathVariable Long id, @RequestBody Shop shop) {
        Shop updated = shopService.update(id, shop);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean removed = shopService.delete(id);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

