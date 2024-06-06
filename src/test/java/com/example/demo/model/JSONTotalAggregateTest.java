package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JSONTotalAggregateTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        JSONTotalAggregate json = new JSONTotalAggregate();
        json.setTotalAmmount(100);
        List<JSONSubAggregate> list = new ArrayList<JSONSubAggregate>();
        json.setItems(list);
        assertThat(json.getTotalAmmount()).isEqualTo(100);
        assertThat(json.getItems()).isEqualTo(list);
    }

}
