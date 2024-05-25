package com.example.demo.primitive;

import java.io.Serializable;

import lombok.Getter;

public class Money implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    @Getter
    private int value;

    public Money(int value) {
        this.value = value;
    }

    public String toDisplay() {
        return String.format("%,d", this.value);
    }
}
