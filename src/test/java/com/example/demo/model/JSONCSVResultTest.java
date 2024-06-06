package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JSONCSVResultTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        JSONCSVResult json = new JSONCSVResult();
        json.setResult(true);
        assertThat(json.isResult()).isTrue();
    }

}
