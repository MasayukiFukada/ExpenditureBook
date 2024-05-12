package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "MonthlyComment")
public class MonthlyCommentEntity {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "year")
    private int year;

    @Column(name = "month")
    private int month;

    @Column(name = "note")
    private String note;
}
