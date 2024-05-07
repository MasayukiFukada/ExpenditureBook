package com.example.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ExpenditureEntity {
	private String id;
	private LocalDate date;
	private String category_id;
	private int ammount;
	private String note;
	private LocalDateTime create_at;
	private LocalDateTime update_at;
}
