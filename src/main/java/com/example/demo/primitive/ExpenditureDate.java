package com.example.demo.primitive;

import java.time.LocalDate;

import lombok.Getter;

public class ExpenditureDate {
    @Getter
    private java.time.LocalDate date;

    public ExpenditureDate(LocalDate arg) {
        this.date = arg;
    }
}
