package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.demo.primitive.CommentNote;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.Month;
import com.example.demo.primitive.Year;

class MonthlyCommentTest {

    @Test
    @DisplayName("通常のテスト")
    void test() {
        MonthlyComment model = new MonthlyComment();
        ID id = new ID();
        model.setId(id);
        model.setYear(new Year(2024));
        model.setMonth(new Month(6));
        CommentNote note = new CommentNote("Sample Comment");
        model.setNote(note);

        assertThat(model.getId()).isEqualTo(id);
        assertThat(model.getYear().getValue()).isEqualTo(2024);
        assertThat(model.getMonth().getValue()).isEqualTo(6);
        assertThat(model.getNote()).isEqualTo(note);
    }

}
