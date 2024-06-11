package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MonthlyCommentsTest {

    @Test
    @DisplayName("通常のテスト")
    void test() {
        MonthlyComment sample = new MonthlyComment();
        List<MonthlyComment> comments = new ArrayList<MonthlyComment>();
        MonthlyComments model = new MonthlyComments(comments);

        assertThat(model.getItems()).isEqualTo(comments);
    }

}
