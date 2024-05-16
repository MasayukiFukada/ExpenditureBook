package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.StringJoiner;

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
    private LocalDateTime create_at;
    private LocalDateTime update_at;

    @Override
    public String toString() {
        StringJoiner joiner = new StringJoiner(",");
        joiner.add("ID: " + this.id.getId());
//        joiner.add(" DATE: " + this.getDate().toString());
        joiner.add(" MONEY: " + this.ammount.getValue());
        joiner.add(" CATEGORY: " + this.category.getId().getId());
        joiner.add(" NOTE: " + this.note.getNote());
        joiner.add(" CREATE_AT: " + this.create_at.toString());
        joiner.add(" UPDATE_AT: " + this.update_at.toString());
        return joiner.toString();
    }
}
