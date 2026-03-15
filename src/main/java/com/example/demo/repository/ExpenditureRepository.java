package com.example.demo.repository;

import com.example.demo.entity.ExpenditureEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ExpenditureRepository
    extends JpaRepository<ExpenditureEntity, String>
{
    List<ExpenditureEntity> findAllByOrderByIdDesc();
    List<ExpenditureEntity> findAllByOrderByDateDesc();

    @Query(
        "SELECT e FROM ExpenditureEntity e ORDER BY e.date DESC, e.category_id DESC"
    )
    List<ExpenditureEntity> findAllByOrderByDateDescCategoryIdDesc();
}
