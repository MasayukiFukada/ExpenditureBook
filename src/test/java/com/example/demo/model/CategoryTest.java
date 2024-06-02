package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.demo.primitive.CategoryNote;

class CategoryTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        int expectedType = 1;
        String expectedCategoryName = "Sample";
        CategoryNote expectedNote = new CategoryNote("Note");
        Category category = new Category(expectedType, expectedCategoryName, expectedNote);
        assertThat(category.getName()).isEqualTo(expectedCategoryName);
        assertThat(category.getNote()).isEqualTo(expectedNote);
    }

}
