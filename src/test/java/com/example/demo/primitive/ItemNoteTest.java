package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ItemNoteTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        ItemNote note = new ItemNote("Sample");
        assertThat(note.getNote()).isEqualTo("Sample");
    }

    @Test
    @DisplayName("セッターのテスト")
    void setterTest() {
        ItemNote note = new ItemNote("first");
        note.setNote("change");
        assertThat(note.getNote()).isEqualTo("change");
    }
}
