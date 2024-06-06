package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JSONMonthlyComment {
    private String id;
    private String comment;
    private int year;
    private int month;
}
