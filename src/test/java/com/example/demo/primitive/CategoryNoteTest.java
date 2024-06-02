package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CategoryNoteTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        CategoryNote note = new CategoryNote("Sample");
        assertThat(note.getNote()).isEqualTo("Sample");
    }

    @Test
    @DisplayName("セッターのテスト")
    void setterTest() {
        CategoryNote note = new CategoryNote("first");
        note.setNote("change");
        assertThat(note.getNote()).isEqualTo("change");
    }
}
