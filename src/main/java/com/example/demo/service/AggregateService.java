package com.example.demo.service;

import com.example.demo.model.AggregateItem;
import com.example.demo.model.Categories;
import com.example.demo.model.Category;
import com.example.demo.model.Expenditure;
import com.example.demo.model.Expenditures;
import com.example.demo.model.JSONAggregateItem;
import com.example.demo.model.JSONSubAggregate;
import com.example.demo.model.JSONTotalAggregate;
import com.example.demo.model.SubAggregate;
import com.example.demo.model.TotalAggregate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    /**
     * JSON に変換
     * * 便宜上「13月」という集計用のデータを追加する
     *
     * @param model 変換元データ
     * @return 変換されたデータ
     */
    public JSONTotalAggregate convertModelToJSONModel(TotalAggregate model) {
        JSONTotalAggregate totalAggregate = new JSONTotalAggregate();
        totalAggregate.setTotalAmmount(model.getTotalAmmount().getValue());
        List<JSONSubAggregate> subItems = new ArrayList<JSONSubAggregate>();
        for (SubAggregate sub : model.getItems()) {
            JSONSubAggregate subItem = new JSONSubAggregate();
            subItem.setMonth(sub.getMonth().getValue());
            subItem.setSubTotalAmmount(sub.getSubTotalAmmount().getValue());
            for (AggregateItem item : sub.getItems()) {
                JSONAggregateItem aggregateItem = convertModelToJSONModel(item);
                subItem.getItems().add(aggregateItem);
            }
            subItems.add(subItem);
        }
        // 集計用の特殊データ
        JSONSubAggregate subSumItem = new JSONSubAggregate();
        subSumItem.setMonth(13);
        subSumItem.setSubTotalAmmount(model.getTotalAmmount().getValue());
        for (Category category : this.categories.getItems()) {
            JSONAggregateItem aggregateItem = new JSONAggregateItem();
            aggregateItem.setCategoryId(category.getId().toString());
            aggregateItem.setCategoryName(category.getName());
            for (JSONSubAggregate calcSubItem : subItems) {
                boolean isFound = false;
                for (JSONAggregateItem calcAggregateItem : calcSubItem.getItems()) {
                    if (calcAggregateItem.getCategoryId().equals(category.getId().getId())) {
                        isFound = true;
                        int currentValue = aggregateItem.getCategoryAmmount();
                        currentValue = currentValue + calcAggregateItem.getCategoryAmmount();
                        aggregateItem.setCategoryAmmount(currentValue);
                    }
                }
                if (!isFound) {
                    aggregateItem.setCategoryAmmount(0);
                }
            }
            subSumItem.getItems().add(aggregateItem);
        }
        subItems.add(subSumItem);

        totalAggregate.setItems(subItems);
        return totalAggregate;
    }

    public JSONAggregateItem convertModelToJSONModel(AggregateItem model) {
        JSONAggregateItem converted = new JSONAggregateItem();
        converted.setCategoryId(model.getCategory().getId().getId());
        converted.setCategoryName(model.getCategory().getName());
        converted.setCategoryAmmount(model.getCategoryAmmount().getValue());
        return converted;
    }
}
