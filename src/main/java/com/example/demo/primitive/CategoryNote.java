package com.example.demo.primitive;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryNote implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    private String note;

    public CategoryNote(String arg) {
        this.note = arg;
    }
}
