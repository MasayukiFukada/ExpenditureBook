package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JSONCategory {
    private String id;
    private int type;
    private String name;
    private String note;
    private boolean isEnable;
    private int sortOrderNo;
    private String createAt;
    private String updateAt;
}
