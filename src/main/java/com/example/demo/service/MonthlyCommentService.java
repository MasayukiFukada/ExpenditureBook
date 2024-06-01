package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.MonthlyCommentEntity;
import com.example.demo.model.MonthlyComment;
import com.example.demo.model.MonthlyComments;
import com.example.demo.primitive.CommentNote;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.Month;
import com.example.demo.primitive.Year;
import com.example.demo.repository.MonthlyCommentRepository;

@Service
@Transactional
public class MonthlyCommentService {
    @Autowired
    MonthlyCommentRepository repository;

    public MonthlyComments getAnnualy(int year) {
        List<MonthlyCommentEntity> entities = repository.findAll();
        MonthlyComments newComments = new MonthlyComments(
                entities.stream().map(i -> convertEntityToModel(i)).collect(Collectors.toList()));
        return newComments;
    }

    @Transactional
    public boolean insert(MonthlyComment comment) {
        try {
            repository.save(convertModelToEntity(comment));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Transactional
    public boolean update(MonthlyComment comment) {
        try {
            repository.save(convertModelToEntity(comment));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private MonthlyComment convertEntityToModel(MonthlyCommentEntity entity) {
        MonthlyComment item = new MonthlyComment();
        item.setId(new ID(entity.getId()));
        item.setYear(new Year(entity.getYear()));
        item.setMonth(new Month(entity.getMonth()));
        item.setNote(new CommentNote(entity.getNote()));
        return item;
    }

    private MonthlyCommentEntity convertModelToEntity(MonthlyComment model) {
        MonthlyCommentEntity item = new MonthlyCommentEntity();
        item.setId(model.getId().getId());
        item.setYear(model.getYear().getValue());
        item.setMonth(model.getMonth().getValue());
        item.setNote(model.getNote().getNote());
        return item;
    }
}
