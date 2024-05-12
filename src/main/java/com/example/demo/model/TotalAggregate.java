package com.example.demo.model;

import java.util.List;

import com.example.demo.primitive.Money;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TotalAggregate {
    private List<SubAggregate> items;
    private Money totalAmmount;

    public TotalAggregate() {
        // ビルドを通すための仮
    }

    public TotalAggregate(List<SubAggregate> arg) {
        this.items = arg;
    }
}
