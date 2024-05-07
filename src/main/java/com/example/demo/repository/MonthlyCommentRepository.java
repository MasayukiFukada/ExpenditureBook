package com.example.demo.repository;

import java.util.Collections;
import java.util.List;

import com.example.demo.entity.MonthlyCommentEntity;

public class MonthlyCommentRepository {
	public List<MonthlyCommentEntity> getAnnualy(int year) {
		return Collections.emptyList();
	}
	
	public String insert(MonthlyCommentEntity comment) {
		return "";
	}
	
	public boolean update(MonthlyCommentEntity comment) {
		return true;
	}
}
