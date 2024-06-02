package com.example.demo.primitive;

import java.io.Serializable;

import lombok.Getter;

public class Month implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    @Getter
    private int value;

    public Month(int value) {
        this.value = returnValidMonth(value);
    }

    private int returnValidMonth(int value) {
        int result = value;
        if (value > 12) {
            result = 12;
        } else if (value < 1) {
            result = 1;
        }
        return result;
    }
}
