package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CommentNoteTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        CommentNote note = new CommentNote("Sample");
        assertThat(note.getNote()).isEqualTo("Sample");
    }

    @Test
    @DisplayName("セッターのテスト")
    void setterTest() {
        CommentNote note = new CommentNote("first");
        note.setNote("change");
        assertThat(note.getNote()).isEqualTo("change");
    }
}
