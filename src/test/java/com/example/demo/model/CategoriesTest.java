package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CategoriesTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        List<Category> list = new ArrayList<Category>();
        Categories categories = new Categories(list);
        assertThat(categories.getItems()).isEqualTo(list);
    }

}
