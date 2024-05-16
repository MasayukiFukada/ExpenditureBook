package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.ExpenditureEntity;

public interface ExpenditureRepository extends JpaRepository<ExpenditureEntity, String> {
    List<ExpenditureEntity> findAllByOrderByIdDesc();
}
