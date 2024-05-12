package com.example.demo.primitive;

import lombok.Getter;

public class Year {
    @Getter
    private int value;

    public Year(int arg) {
        this.value = arg;
    }
}
