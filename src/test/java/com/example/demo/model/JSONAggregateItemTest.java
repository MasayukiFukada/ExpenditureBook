package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JSONAggregateItemTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        JSONAggregateItem json = new JSONAggregateItem();
        json.setCategoryName("SampleName");
        json.setCategoryId("TestID");
        json.setCategoryAmmount(100);
        assertThat(json.getCategoryName()).isEqualTo("SampleName");
        assertThat(json.getCategoryId()).isEqualTo("TestID");
        assertThat(json.getCategoryAmmount()).isEqualTo(100);
    }

}
