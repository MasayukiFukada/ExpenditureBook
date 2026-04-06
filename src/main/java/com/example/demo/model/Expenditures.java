package com.example.demo.model;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
public class Expenditures implements Serializable {
    private static final long serialVersionUID = 1L;
    @Getter
    private List<Expenditure> items;

    public Expenditures(List<Expenditure> arg) {
        this.items = arg;
    }
}
