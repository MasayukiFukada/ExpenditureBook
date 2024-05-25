package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JSONSubAggregate {
    private int month;
    private int subTotalAmmount;
    private List<JSONAggregateItem> items = new ArrayList<JSONAggregateItem>();
}
