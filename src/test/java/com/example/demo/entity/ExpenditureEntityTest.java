package com.example.demo.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ExpenditureEntityTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        ExpenditureEntity entity = new ExpenditureEntity();
        assertThat(entity).isNotNull();
    }

}
