package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MoneyTest {
    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        Money money = new Money(200);
        assertThat(money.getValue()).isEqualTo(200);
    }

    @Test
    @DisplayName("3桁未満の場合")
    void under3DigitTest() {
        Money money = new Money(100);
        assertThat(money.toDisplay()).isEqualTo("100");
    }

    @Test
    @DisplayName("3桁以上の場合")
    void over3DigitTest() {
        Money money = new Money(1000);
        assertThat(money.toDisplay()).isEqualTo("1,000");
    }
}
