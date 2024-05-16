package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JSONExpenditure {
    private String id;
    private String date;
    private int ammount;
    private String category_id;
    private String category_name;
    private String note;
    private String update_at;
}
