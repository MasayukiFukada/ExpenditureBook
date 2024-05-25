package com.example.demo.primitive;

import java.io.Serializable;

import lombok.Getter;

public class Month implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    @Getter
    private int value;

    public Month(int value) {
        this.setValue(value);
    }

    public void setValue(int value) {
        if (value > 12) {
            value = 12;
        } else if (value < 1) {
            value = 1;
        } else {
            this.value = value;
        }
    }
}
