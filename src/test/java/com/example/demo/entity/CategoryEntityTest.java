package com.example.demo.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CategoryEntityTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        CategoryEntity entity = new CategoryEntity();
        assertThat(entity).isNotNull();
    }

}
