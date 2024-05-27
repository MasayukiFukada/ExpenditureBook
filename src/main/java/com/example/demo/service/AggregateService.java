package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.AggregateItem;
import com.example.demo.model.Categories;
import com.example.demo.model.Expenditure;
import com.example.demo.model.Expenditures;
import com.example.demo.model.JSONAggregateItem;
import com.example.demo.model.JSONSubAggregate;
import com.example.demo.model.JSONTotalAggregate;
import com.example.demo.model.SubAggregate;
import com.example.demo.model.TotalAggregate;

@Service
public class AggregateService {
    private TotalAggregate templateTotalAggregate = new TotalAggregate();

    private Categories categories;

    @Autowired
    ExpenditureService expenditureService;

    boolean isInitialized = false;

    public void Initialize(CategoryService service) {
        if (!isInitialized) {
            isInitialized = true;
            this.categories = service.getAll();
            this.templateTotalAggregate.Initialize(this.categories);
        }
    }

    public TotalAggregate getAnnualy(int year) {
        TotalAggregate copy = templateTotalAggregate.copy();
        Expenditures source = expenditureService.retrieve(year);
        for (Expenditure item : source.getItems()) {
            copy.append(item);
        }
        return copy;
    }

    public TotalAggregate getMonthly(int year, int month) {
        TotalAggregate copy = templateTotalAggregate.copy();
        return copy;
    }

    public static JSONTotalAggregate convertModelToJSONModel(TotalAggregate model) {
        JSONTotalAggregate totalAggregate = new JSONTotalAggregate();
        totalAggregate.setTotalAmmount(model.getTotalAmmount().getValue());
        List<JSONSubAggregate> subItems = new ArrayList<JSONSubAggregate>();
        for (SubAggregate sub : model.getItems()) {
            JSONSubAggregate subItem = new JSONSubAggregate();
            subItem.setMonth(sub.getMonth().getValue());
            subItem.setSubTotalAmmount(sub.getSubTotalAmmount().getValue());
            for (AggregateItem item : sub.getItems()) {
                JSONAggregateItem aggregateItem = AggregateService.convertModelToJSONModel(item);
                subItem.getItems().add(aggregateItem);
            }
            subItems.add(subItem);
        }
        totalAggregate.setItems(subItems);
        return totalAggregate;
    }

    public static JSONAggregateItem convertModelToJSONModel(AggregateItem model) {
        JSONAggregateItem converted = new JSONAggregateItem();
        converted.setCategoryId(model.getCategory().getId().getId());
        converted.setCategoryName(model.getCategory().getName());
        converted.setCategoryAmmount(model.getCategoryAmmount().getValue());
        return converted;
    }
}
