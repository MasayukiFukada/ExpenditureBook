package com.example.demo.primitive;

import java.io.Serializable;
import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExpenditureDate implements Serializable {
    private static final long serialVersionUID = 1L;
    private java.time.LocalDate date;

    public ExpenditureDate(LocalDate arg) {
        this.date = arg;
    }
}
