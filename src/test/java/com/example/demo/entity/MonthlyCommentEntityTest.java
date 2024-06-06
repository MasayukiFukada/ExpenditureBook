package com.example.demo.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MonthlyCommentEntityTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        MonthlyCommentEntity entity = new MonthlyCommentEntity();
        assertThat(entity).isNotNull();
    }

    @Test
    @DisplayName("Getter と Setter")
    void getterAndSetterTest() {
        MonthlyCommentEntity entity = new MonthlyCommentEntity();
        entity.setId("ID String");
        entity.setNote("Sample Note");
        entity.setYear(2024);
        entity.setMonth(6);

        assertThat(entity.getId()).isEqualTo("ID String");
        assertThat(entity.getNote()).isEqualTo("Sample Note");
        assertThat(entity.getYear()).isEqualTo(2024);
        assertThat(entity.getMonth()).isEqualTo(6);
    }
}
