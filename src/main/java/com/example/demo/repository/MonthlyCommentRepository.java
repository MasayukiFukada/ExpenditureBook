package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.MonthlyCommentEntity;

public interface MonthlyCommentRepository extends JpaRepository<MonthlyCommentEntity, String> {
}
