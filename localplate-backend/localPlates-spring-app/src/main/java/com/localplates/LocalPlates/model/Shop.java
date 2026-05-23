package com.localplates.LocalPlates.model;

import java.util.ArrayList;
import java.util.List;

public class Shop {
    private Long id;
    private String name;
    private double lat;
    private double lng;
    private List<MenuItem> items = new ArrayList<>();

    public Shop() {}

    public Shop(Long id, String name, double lat, double lng, List<MenuItem> items) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.items = items == null ? new ArrayList<>() : items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public List<MenuItem> getItems() {
        return items;
    }

    public void setItems(List<MenuItem> items) {
        this.items = items;
    }
}

