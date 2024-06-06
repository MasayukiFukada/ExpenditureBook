package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.demo.primitive.Money;

class AggregateItemTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        Category category = new Category();
        AggregateItem item = new AggregateItem(category);
        assertThat(item.getCategory()).isEqualTo(category);
        assertThat(item.getCategoryAmmount().getValue()).isEqualTo(0);
    }

    @Test
    @DisplayName("Getter と Setter のテスト")
    void getterAndSetterTest() {
        Category category = new Category();
        AggregateItem item = new AggregateItem(category);
        Category other = new Category();
        item.setCategory(other);
        Money money = new Money(100);
        item.setCategoryAmmount(money);
        assertThat(item.getCategory()).isNotEqualTo(category);
        assertThat(item.getCategory()).isEqualTo(other);
        assertThat(item.getCategoryAmmount()).isEqualTo(money);
    }
}
