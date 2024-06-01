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
import com.example.demo.model.JSONExpenditure;
import com.example.demo.primitive.ExpenditureDate;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.ItemNote;
import com.example.demo.primitive.Money;
import com.example.demo.repository.ExpenditureRepository;

@Service
@Transactional
public class ExpenditureService {
    @Autowired
    CategoryService categoryService;

    @Autowired
    ExpenditureRepository repository;

    public Expenditures retrieve(int year) {
        List<ExpenditureEntity> entities = repository.findAllByOrderByIdDesc();
        Expenditures newExpenditures = new Expenditures(
                entities.stream().filter(i -> i.getDate().getYear() == year).map(i -> convertEntityToModel(i))
                        .collect(Collectors.toList()));
        return newExpenditures;
    }

    public Expenditures retrieve(int year, int month) {
        List<ExpenditureEntity> entities = repository.findAllByOrderByIdDesc();
        Expenditures newExpenditures = new Expenditures(
                entities.stream().filter(i -> i.getDate().getYear() == year)
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
        item.setAmmount(new Money(entity.getAmmount()));
        item.setDate(new ExpenditureDate(entity.getDate()));
        item.setCategory(categoryService.getCategoryById(entity.getCategory_id()));
        item.setNote(new ItemNote(entity.getNote()));
        item.setCreate_at(entity.getCreate_at());
        item.setUpdate_at(entity.getUpdate_at());
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

    public JSONExpenditure convertModelToJSONModel(Expenditure model) {
        JSONExpenditure converted = new JSONExpenditure();
        converted.setId(model.getId().getId());
        converted.setDate(model.getDate().getDate().toString());
        converted.setAmmount(model.getAmmount().getValue());
        converted.setCategory_id(model.getCategory().getId().getId());
        converted.setCategory_name(model.getCategory().getName());
        converted.setNote(model.getNote().getNote());
        converted.setUpdate_at(model.getUpdate_at().toString());
        return converted;
    }
}
