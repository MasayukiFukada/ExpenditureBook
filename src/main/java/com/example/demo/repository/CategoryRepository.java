package com.example.demo.repository;

import java.util.Collections;
import java.util.List;

import com.example.demo.entity.CategoryEntity;

public class CategoryRepository {
	public List<CategoryEntity> getAll() {
		return Collections.emptyList();
	}
	
	public String insert(CategoryEntity entity) {
		return "";
	}
	
	public boolean update(CategoryEntity entity) {
		return true;
	}
	
	public boolean delete(CategoryEntity entity) {
		return true;
	}
}
