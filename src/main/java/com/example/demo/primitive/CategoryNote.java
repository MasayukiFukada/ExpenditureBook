package com.example.demo.primitive;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryNote {
    private String note;

    public CategoryNote(String arg) {
        this.note = arg;
    }
}
