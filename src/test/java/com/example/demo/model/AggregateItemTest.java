package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AggregateItemTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        Category category = new Category();
        AggregateItem item = new AggregateItem(category);
        assertThat(item.getCategory()).isEqualTo(category);
        assertThat(item.getCategoryAmmount().getValue()).isEqualTo(0);
    }

}
