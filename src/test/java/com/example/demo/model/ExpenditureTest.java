package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.StringJoiner;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.demo.primitive.CategoryNote;
import com.example.demo.primitive.ExpenditureDate;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.ItemNote;
import com.example.demo.primitive.Money;

class ExpenditureTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        Expenditure model = new Expenditure();
    }

    @Test
    @DisplayName("文字列化のテスト")
    void toStringTest() {
        Expenditure model = new Expenditure();
        ID id = new ID("Test ID");
        model.setId(id);
        CategoryNote catNote = new CategoryNote("Category Note");
        Category category = new Category(5, "Test Category", catNote);
        model.setCategory(category);
        ItemNote note = new ItemNote("Sample Note");
        model.setNote(note);
        LocalDate now = LocalDate.now();
        ExpenditureDate date = new ExpenditureDate(now);
        model.setDate(date);
        Money money = new Money(100);
        model.setAmmount(money);
        LocalDateTime create = LocalDateTime.now();
        model.setCreate_at(create);
        LocalDateTime update = LocalDateTime.now();
        model.setUpdate_at(update);

        StringJoiner joiner = new StringJoiner(",");
        joiner.add("ID: " + model.getId().getId());
        joiner.add(" DATE: " + model.getDate().getDate().toString());
        joiner.add(" MONEY: " + model.getAmmount().getValue());
        joiner.add(" CATEGORY: " + model.getCategory().getId().getId());
        joiner.add(" NOTE: " + model.getNote().getNote());
        joiner.add(" CREATE_AT: " + model.getCreate_at().toString());
        joiner.add(" UPDATE_AT: " + model.getUpdate_at().toString());
        assertThat(model.toString()).isEqualTo(joiner.toString());
    }
}
