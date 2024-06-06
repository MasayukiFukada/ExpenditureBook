package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class JSONCategoryTest {

    @Test
    void test() {
        JSONCategory json = new JSONCategory();
        json.setId("TestID");
        json.setName("SampleName");
        json.setNote("TestNote");
        json.setSortOrderNo(5);
        json.setType(2);
        json.setEnable(true);
        json.setCreateAt("2024/06/01T00:00:00");
        json.setUpdateAt("2024/06/01T12:34:56");

        assertThat(json.getId()).isEqualTo("TestID");
        assertThat(json.getName()).isEqualTo("SampleName");
        assertThat(json.getNote()).isEqualTo("TestNote");
        assertThat(json.getSortOrderNo()).isEqualTo(5);
        assertThat(json.getType()).isEqualTo(2);
        assertThat(json.isEnable()).isTrue();
        assertThat(json.getCreateAt()).isEqualTo("2024/06/01T00:00:00");
        assertThat(json.getUpdateAt()).isEqualTo("2024/06/01T12:34:56");
    }

}
