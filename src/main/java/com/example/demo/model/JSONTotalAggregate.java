package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JSONTotalAggregate {
    private int totalAmmount;
    private List<JSONSubAggregate> items = new ArrayList<JSONSubAggregate>();
}
