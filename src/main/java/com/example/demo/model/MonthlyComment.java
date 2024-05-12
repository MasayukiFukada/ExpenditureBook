package com.example.demo.model;

import com.example.demo.primitive.CommentNote;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.Month;
import com.example.demo.primitive.Year;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthlyComment {
    private ID id;
    private Year year;
    private Month month;
    private CommentNote note;
}
