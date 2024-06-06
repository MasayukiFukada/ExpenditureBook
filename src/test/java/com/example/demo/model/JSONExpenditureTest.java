package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JSONExpenditureTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        JSONExpenditure json = new JSONExpenditure();
        json.setId("TestID");
        json.setAmmount(100);
        json.setCategory_id("CategoryID");
        json.setCategory_name("SampleCategory");
        json.setNote("SampleNote");
        json.setDate("2024/06/01");
        json.setUpdate_at("2024/06/01T22:00:30");
        assertThat(json.getId()).isEqualTo("TestID");
        assertThat(json.getAmmount()).isEqualTo(100);
        assertThat(json.getCategory_id()).isEqualTo("CategoryID");
        assertThat(json.getCategory_name()).isEqualTo("SampleCategory");
        assertThat(json.getNote()).isEqualTo("SampleNote");
        assertThat(json.getDate()).isEqualTo("2024/06/01");
        assertThat(json.getUpdate_at()).isEqualTo("2024/06/01T22:00:30");
    }

}
