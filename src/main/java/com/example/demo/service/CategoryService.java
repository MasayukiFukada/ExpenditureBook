package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.CategoryEntity;
import com.example.demo.model.Categories;
import com.example.demo.model.Category;
import com.example.demo.primitive.CategoryNote;
import com.example.demo.primitive.ID;
import com.example.demo.repository.CategoryRepository;

@Service
@Transactional
public class CategoryService {
    @Autowired
    CategoryRepository repository;

    public CategoryService() {
    }

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public Categories getAll() {
        // List<CategoryEntity> entities =
        // repository.findAll(Sort.by(Sort.Direction.ASC, "sort_order_no"));
        List<CategoryEntity> entities = repository.findByOrderBySortOrderNoAsc();
        Categories newCategories = new Categories(
                entities.stream().map(i -> convertEntityToModel(i)).collect(Collectors.toList()));
        return newCategories;
    }

    @Transactional
    public Boolean insert(Category category) {
        try {
            repository.save(convertModelToEntity(category));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Transactional
    public boolean update(Category category) {
        try {
            repository.save(convertModelToEntity(category));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Transactional
    public boolean delete(Category category) {
        try {
            repository.delete(convertModelToEntity(category));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private Category convertEntityToModel(CategoryEntity entity) {
        Category item = new Category(entity.getType(), entity.getName(), new CategoryNote(entity.getNote()));
        item.setId(new ID(entity.getId()));
        item.setNote(new CategoryNote(entity.getNote()));
        item.setSort_order_no(entity.getSortOrderNo());
        item.set_enable(entity.is_enable());
        item.setCreate_at(entity.getCreate_at());
        item.setUpdate_at(entity.getUpdate_at());
        return item;
    }

    private CategoryEntity convertModelToEntity(Category model) {
        CategoryEntity item = new CategoryEntity();
        item.setId(model.getId().getId());
        item.setNote(model.getNote().getNote());
        item.setType(model.getType());
        item.setName(model.getName());
        item.set_enable(model.is_enable());
        item.setSortOrderNo(model.getSort_order_no());
        if (model.getCreate_at() == null) {
            item.setCreate_at(LocalDateTime.now());
        } else {
            item.setCreate_at(model.getCreate_at());
        }
        item.setUpdate_at(LocalDateTime.now());
        return item;
    }
}
