package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JSONMonthlyCommentTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        JSONMonthlyComment model = new JSONMonthlyComment();
        model.setId("Sample ID");
        model.setComment("Test Comment");
        model.setYear(2024);
        model.setMonth(6);
        assertThat(model.getId()).isEqualTo("Sample ID");
        assertThat(model.getComment()).isEqualTo("Test Comment");
        assertThat(model.getYear()).isEqualTo(2024);
        assertThat(model.getMonth()).isEqualTo(6);
    }

}
