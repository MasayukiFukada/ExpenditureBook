package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JSONSubAggregateTest {
    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        JSONSubAggregate json = new JSONSubAggregate();
        json.setMonth(5);
        json.setSubTotalAmmount(100);
        List<JSONAggregateItem> list = new ArrayList<JSONAggregateItem>();
        json.setItems(list);

        assertThat(json.getMonth()).isEqualTo(5);
        assertThat(json.getSubTotalAmmount()).isEqualTo(100);
        assertThat(json.getItems()).isEqualTo(list);
    }
}
