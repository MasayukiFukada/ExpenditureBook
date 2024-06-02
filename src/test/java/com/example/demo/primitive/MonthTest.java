package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MonthTest {

    @Test
    @DisplayName("通常のテスト")
    void testSetValue() {
        Month month = new Month(5);
        assertThat(month.getValue()).isEqualTo(5);
    }

    @Test
    @DisplayName("12を超える場合")
    void testOver12() {
        Month month = new Month(13);
        assertThat(month.getValue()).isEqualTo(12);
    }

    @Test
    @DisplayName("1を切る場合")
    void testUnder1() {
        Month month = new Month(0);
        assertThat(month.getValue()).isEqualTo(1);
    }

}
