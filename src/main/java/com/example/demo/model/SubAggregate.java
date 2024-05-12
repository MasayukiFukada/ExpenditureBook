package com.example.demo.model;

import java.util.List;

import com.example.demo.primitive.Money;
import com.example.demo.primitive.Month;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubAggregate {
    private List<AggregateItem> items;
    private Month month;
    private Money subTotalAmmount;

    public SubAggregate(List<AggregateItem> arg) {
        this.items = arg;
    }
}
