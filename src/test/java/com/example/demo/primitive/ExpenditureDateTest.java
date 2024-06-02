package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ExpenditureDateTest {

    @Test
    @DisplayName("通常のテスト")
    void testNew() {
        LocalDate now = LocalDate.now();
        ExpenditureDate date = new ExpenditureDate(now);
        assertThat(date.getDate()).isEqualTo(now);
    }

}
