package com.example.demo.model;

import com.example.demo.primitive.ExpenditureDate;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.ItemNote;
import com.example.demo.primitive.Money;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Expenditure {
    private ID id;
    private ExpenditureDate date;
    private Money ammount;
    private Category category;
    private ItemNote note;
}
