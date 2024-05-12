package com.example.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Expenditure")
public class ExpenditureEntity {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "category_id")
    private String category_id;

    @Column(name = "ammount")
    private int ammount;

    @Column(name = "note")
    private String note;

    @Column(name = "create_at")
    private LocalDateTime create_at;

    @Column(name = "update_at")
    private LocalDateTime update_at;
}
