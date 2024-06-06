package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ExpendituresTest {
    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        List<Expenditure> list = new ArrayList<Expenditure>();
        Expenditures models = new Expenditures(list);
        assertThat(models.getItems()).isEqualTo(list);
    }

}
