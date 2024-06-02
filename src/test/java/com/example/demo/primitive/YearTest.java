package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class YearTest {

    @Test
    @DisplayName("通常のテスト")
    void testNew() {
        Year year = new Year(2024);
        assertThat(year.getValue()).isEqualTo(2024);
    }

}
