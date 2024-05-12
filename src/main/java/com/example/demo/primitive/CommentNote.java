package com.example.demo.primitive;

import lombok.Getter;
import lombok.Setter;

public class CommentNote {
    @Getter
    @Setter
    private String note;

    public CommentNote(String arg) {
        this.note = arg;
    }
}
