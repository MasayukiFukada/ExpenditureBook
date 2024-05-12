package com.example.demo.model;

import com.example.demo.primitive.Money;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AggregateItem {
    private Category category;
    private Money categoryAmmount;
}
