package com.example.demo.entity;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CategoryEntityTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        CategoryEntity entity = new CategoryEntity();
        assertThat(entity).isNotNull();
    }

    @Test
    @DisplayName("Getter と Setter")
    void getterAndSetterTest() {
        CategoryEntity entity = new CategoryEntity();
        entity.set_enable(true);
        entity.setId("ID String");
        entity.setName("Sample Name");
        entity.setNote("Test Note");
        entity.setSortOrderNo(5);
        entity.setType(2);
        LocalDateTime create = LocalDateTime.now();
        entity.setCreate_at(create);
        LocalDateTime update = LocalDateTime.now();
        entity.setUpdate_at(update);

        assertThat(entity.is_enable()).isTrue();
        assertThat(entity.getId()).isEqualTo("ID String");
        assertThat(entity.getName()).isEqualTo("Sample Name");
        assertThat(entity.getNote()).isEqualTo("Test Note");
        assertThat(entity.getSortOrderNo()).isEqualTo(5);
        assertThat(entity.getType()).isEqualTo(2);
        assertThat(entity.getCreate_at()).isEqualTo(create);
        assertThat(entity.getUpdate_at()).isEqualTo(update);
    }
}
