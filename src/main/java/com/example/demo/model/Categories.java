package com.example.demo.model;

import java.util.List;

import lombok.Getter;

public class Categories {
    @Getter
    private List<Category> items;

    public Categories(List<Category> arg) {
        this.items = arg;
    }
}
