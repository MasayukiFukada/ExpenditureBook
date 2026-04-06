package com.example.demo.primitive;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ItemNote implements Serializable {
    private static final long serialVersionUID = 1L;
    private String note;

    public ItemNote(String arg) {
        this.note = arg;
    }
}
