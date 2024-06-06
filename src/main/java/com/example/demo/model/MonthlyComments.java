package com.example.demo.model;

import java.util.List;

import lombok.Getter;

public class MonthlyComments {
    @Getter
    private List<MonthlyComment> items;

    public MonthlyComments(List<MonthlyComment> arg) {
        this.items = arg;
    }
}
