package com.example.demo.primitive;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MoneyTest {

    @Test
    @DisplayName("3桁未満の場合")
    void under3DigitTest() {
        Money money = new Money(100);
        assertTrue(money.toDisplay() == "100");
    }

    @Test
    @DisplayName("3桁以上の場合")
    void over3DigitTest() {
        Money money = new Money(1000);
        assertTrue(money.toDisplay() == "1,000");
    }
}
