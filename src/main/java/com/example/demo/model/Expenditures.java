package com.example.demo.model;

import java.util.List;

import lombok.Getter;

public class Expenditures {
    @Getter
    private List<Expenditure> items;

    public Expenditures(List<Expenditure> arg) {
        this.items = arg;
    }
}
