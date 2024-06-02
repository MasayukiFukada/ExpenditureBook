package com.example.demo.primitive;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class IDTest {

    @Test
    @DisplayName("通常の初期化")
    void initinalTest() {
        ID id = new ID();
        assertThat(id.isSet()).isFalse();
        assertThat(id.getId()).isEqualTo("");
    }

    @Test
    @DisplayName("初期値付きで初期化")
    void initialValueTest() {
        ID id = new ID("first");
        assertThat(id.isSet()).isTrue();
        assertThat(id.getId()).isEqualTo("first");
    }

    @Test
    @DisplayName("Ver4をセット")
    void v4Test() {
        ID id = new ID();
        id.setNewVer4ID();
        assertThat(id.isSet()).isTrue();
        assertThat(id.getId()).isNotEqualTo("");

        String before = id.getId();
        id.setNewVer4ID();
        assertThat(id.getId()).isEqualTo(before);
    }

    @Test
    @DisplayName("Ver7をセット")
    void v7Test() {
        ID id = new ID();
        id.setNewVer7ID();
        assertThat(id.isSet()).isTrue();
        assertThat(id.getId()).isNotEqualTo("");

        String before = id.getId();
        id.setNewVer7ID();
        assertThat(id.getId()).isEqualTo(before);
    }
}
