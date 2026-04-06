package com.example.demo.primitive;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Year implements Serializable {
    private static final long serialVersionUID = 1L;
    private int value;

    public Year(int arg) {
        this.value = arg;
    }
}
