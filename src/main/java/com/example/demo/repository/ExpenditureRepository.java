package com.example.demo.repository;

import java.util.Collections;
import java.util.List;

import com.example.demo.entity.ExpenditureEntity;

public class ExpenditureRepository {
	public List<ExpenditureEntity> getAnnualy(int year) {
		return Collections.emptyList();
	}
	
	public List<ExpenditureEntity> getMonthly(int year, int month) {
		return Collections.emptyList();
	}
	
	public String insert(ExpenditureEntity entity) {
		return "";
	}
	
	public boolean update(ExpenditureEntity entity) {
		return true;
	}
	
	public boolean delete(ExpenditureEntity entity) {
		return true;
	}
}
