package com.example.demo.entity;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ExpenditureEntityTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        ExpenditureEntity entity = new ExpenditureEntity();
        assertThat(entity).isNotNull();
    }

    @Test
    @DisplayName("Getter と Setter")
    void getterAndSetterTest() {
        ExpenditureEntity entity = new ExpenditureEntity();
        entity.setAmmount(100);
        entity.setCategory_id("Category ID");
        LocalDate date = LocalDate.now();
        entity.setDate(date);
        entity.setId("ID String");
        entity.setNote("Sample Note");
        LocalDateTime create = LocalDateTime.now();
        entity.setCreate_at(create);
        LocalDateTime update = LocalDateTime.now();
        entity.setUpdate_at(update);

        assertThat(entity.getId()).isEqualTo("ID String");
        assertThat(entity.getNote()).isEqualTo("Sample Note");
        assertThat(entity.getAmmount()).isEqualTo(100);
        assertThat(entity.getCategory_id()).isEqualTo("Category ID");
        assertThat(entity.getDate()).isEqualTo(date);
        assertThat(entity.getCreate_at()).isEqualTo(create);
        assertThat(entity.getUpdate_at()).isEqualTo(update);
    }
}
