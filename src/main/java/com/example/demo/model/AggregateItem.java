package com.example.demo.model;

import java.io.Serializable;

import com.example.demo.primitive.Money;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AggregateItem implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    private Category category;
    private Money categoryAmmount;

    public AggregateItem(Category category) {
        this.category = category;
        this.categoryAmmount = new Money(0);
    }
}
