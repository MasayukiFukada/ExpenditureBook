package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.ExpenditureEntity;
import com.example.demo.model.Expenditure;
import com.example.demo.model.Expenditures;
import com.example.demo.primitive.ID;
import com.example.demo.repository.ExpenditureRepository;

@Service
@Transactional
public class ExpenditureService {
    @Autowired
    ExpenditureRepository repository;

    public Expenditures getMonthly(int year, int month) {
        List<ExpenditureEntity> entities = repository.findAll();
        Expenditures newExpenditures = new Expenditures(entities.stream().filter(i -> i.getDate().getYear() == year)
                .filter(i -> i.getDate().getMonthValue() == month).map(i -> convertEntityToModel(i))
                .collect(Collectors.toList()));
        return newExpenditures;
    }

    @Transactional
    public boolean insert(Expenditure expenditure) {
        try {
            repository.save(convertModelToEntity(expenditure));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Transactional
    public boolean update(Expenditure expenditure) {
        try {
            repository.save(convertModelToEntity(expenditure));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Transactional
    public boolean delete(Expenditure expenditure) {
        try {
            repository.delete(convertModelToEntity(expenditure));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private Expenditure convertEntityToModel(ExpenditureEntity entity) {
        Expenditure item = new Expenditure();
        item.setId(new ID(entity.getId()));
        return item;
    }

    private ExpenditureEntity convertModelToEntity(Expenditure model) {
        ExpenditureEntity item = new ExpenditureEntity();
        item.setId(model.getId().getId());
        item.setAmmount(model.getAmmount().getValue());
        item.setDate(model.getDate().getDate());
        item.setNote(model.getNote().getNote());
        item.setCategory_id(model.getCategory().getId().getId());
        if (model.getCreate_at() == null) {
            item.setCreate_at(LocalDateTime.now());
        } else {
            item.setCreate_at(model.getCreate_at());
        }
        item.setUpdate_at(LocalDateTime.now());
        return item;
    }
}
