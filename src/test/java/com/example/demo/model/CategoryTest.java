package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.StringJoiner;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.demo.primitive.CategoryNote;
import com.example.demo.primitive.ID;

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

    @Test
    @DisplayName("Getter と Setter のテスト")
    void getterAndSetterTest() {
        Category category = new Category();
        ID id = new ID();
        category.setId(id);
        category.setName("Category Name");
        category.setSort_order_no(5);
        category.set_enable(true);
        CategoryNote note = new CategoryNote("Sample Note");
        category.setNote(note);
        category.setType(2);
        LocalDateTime create = LocalDateTime.now();
        category.setCreate_at(create);
        LocalDateTime update = LocalDateTime.now();
        category.setUpdate_at(update);

        assertThat(category.getId()).isEqualTo(id);
        assertThat(category.getName()).isEqualTo("Category Name");
        assertThat(category.getSort_order_no()).isEqualTo(5);
        assertThat(category.is_enable()).isTrue();
        assertThat(category.getNote()).isEqualTo(note);
        assertThat(category.getType()).isEqualTo(2);
        assertThat(category.getCreate_at()).isEqualTo(create);
        assertThat(category.getUpdate_at()).isEqualTo(update);
    }

    @Test
    @DisplayName("文字列化のテスト")
    void toStringTest() {
        Category category = new Category();
        ID id = new ID();
        category.setId(id);
        category.setName("Category Name");
        category.setSort_order_no(5);
        CategoryNote note = new CategoryNote("Sample Note");
        category.setNote(note);
        category.setType(2);
        LocalDateTime create = LocalDateTime.now();
        category.setCreate_at(create);
        LocalDateTime update = LocalDateTime.now();
        category.setUpdate_at(update);

        StringJoiner expected = new StringJoiner(",");
        expected.add("【カテゴリ】");
        expected.add("ID: " + id.getId());
        expected.add("TYPE: " + category.getType());
        expected.add("NAME: " + category.getName());
        expected.add("NOTE: " + category.getNote().getNote());
        expected.add("SORT_ORDER: " + category.getSort_order_no());
        expected.add("IS_ENABLE: " + category.is_enable());
        expected.add("CREATE_AT: " + category.getCreate_at());
        expected.add("UPDATE_AT: " + category.getUpdate_at());
        assertThat(category.toString()).isEqualTo(expected.toString());
    }
}
