package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CategoryEntity {
	private String id;
	private int type;
	private String name;
	private String note;
	private boolean is_enable;
	private int sort_order_no;
	private LocalDateTime create_at;
	private LocalDateTime update_at;
}
