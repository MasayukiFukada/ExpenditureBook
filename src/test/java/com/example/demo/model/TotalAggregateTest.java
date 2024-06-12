package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.demo.primitive.ExpenditureDate;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.Money;

class TotalAggregateTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        List<Category> list = new ArrayList<Category>();
        list.add(getCategory("cat1"));
        list.add(getCategory("cat2"));
        Categories categories = new Categories(list);
        TotalAggregate model = new TotalAggregate();
        model.Initialize(categories);

        assertThat(model.getItems().size()).isEqualTo(12);
        assertThat(model.getTotalAmmount().getValue()).isEqualTo(0);

        Expenditure exp1 = getExpenditure("cat1", 100, LocalDate.of(2024, 1, 10));
        Expenditure exp2 = getExpenditure("cat1", 200, LocalDate.of(2024, 2, 5));
        model.append(exp1);
        model.append(exp2);

        SubAggregate jan = model.getItems().stream().filter(i -> i.getMonth().getValue() == 1).findFirst().get();
        SubAggregate feb = model.getItems().stream().filter(i -> i.getMonth().getValue() == 2).findFirst().get();

        assertThat(jan.getSubTotalAmmount().getValue()).isEqualTo(100);
        assertThat(feb.getSubTotalAmmount().getValue()).isEqualTo(200);
        assertThat(model.getTotalAmmount().getValue()).isEqualTo(300);
    }

    @Test
    @DisplayName("ゲッターセッターのテスト")
    void simpleGetterSetterTest() {
        TotalAggregate model = new TotalAggregate();
        model.setTotalAmmount(new Money(100));

        assertThat(model.getTotalAmmount().getValue()).isEqualTo(100);
    }

    @Test
    @DisplayName("コピーのテスト")
    void copyTest() {
        TotalAggregate source = new TotalAggregate();
        TotalAggregate copied = source.copy();

        assertThat(copied).isNotEqualTo(source);
    }

    private Expenditure getExpenditure(String name, int value, LocalDate date) {
        Category category = new Category();
        ID id = new ID(name);
        category.setId(id);
        Expenditure result = new Expenditure();
        result.setCategory(category);
        result.setAmmount(new Money(value));
        result.setDate(new ExpenditureDate(date));
        return result;
    }

    private Category getCategory(String name) {
        Category category = new Category();
        ID id = new ID(name);
        category.setId(id);
        return category;
    }
}
