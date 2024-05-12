package com.example.demo.primitive;

import lombok.Getter;
import lombok.Setter;

public class ItemNote {
    @Getter
    @Setter
    private String note;

    public ItemNote(String arg) {
        this.note = arg;
    }
}
