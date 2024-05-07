package com.example.demo.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class MonthlyCommentEntity {
	private String id;
	private int year;
	private int month;
	private String note;
}
