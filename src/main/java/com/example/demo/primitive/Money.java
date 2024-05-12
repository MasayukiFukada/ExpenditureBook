package com.example.demo.primitive;

import lombok.Getter;

public class Money {
    @Getter
    private int value;

    public Money(int value) {
        this.value = value;
    }

    public String toDisplay() {
        return String.format("%,d", this.value);
    }
}
