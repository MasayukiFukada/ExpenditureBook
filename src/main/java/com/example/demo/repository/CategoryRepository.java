package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.CategoryEntity;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, String> {
    // この定義だけで作成可能だが、エンティティのメンバ名には注意( 参照: エンティティ )
    List<CategoryEntity> findByOrderBySortOrderNoAsc();
}
