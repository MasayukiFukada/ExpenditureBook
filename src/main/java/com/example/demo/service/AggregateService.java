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
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class AggregateService {

    @Autowired
    ExpenditureService expenditureService;

    @Autowired
    CategoryService categoryService;

    @Cacheable(value = "aggregates", key = "#year")
    public TotalAggregate getAnnualy(int year) {
        TotalAggregate copy = new TotalAggregate();
        copy.Initialize(categoryService.getAll());
        
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

        // SubAggregateをJSONSubAggregateに変換
        List<JSONSubAggregate> subItems = model
            .getItems()
            .stream()
            .map(this::convertSubAggregateToJSON)
            .collect(Collectors.toList());

        // 集計用の特殊データ（13月）を作成
        JSONSubAggregate subSumItem = createMonthlyAggregateItem(
            subItems,
            model.getTotalAmmount().getValue()
        );
        subItems.add(subSumItem);

        totalAggregate.setItems(subItems);
        return totalAggregate;
    }

    /**
     * SubAggregateをJSONSubAggregateに変換
     *
     * @param sub 変換元データ
     * @return 変換されたデータ
     */
    private JSONSubAggregate convertSubAggregateToJSON(SubAggregate sub) {
        JSONSubAggregate subItem = new JSONSubAggregate();
        subItem.setMonth(sub.getMonth().getValue());
        subItem.setSubTotalAmmount(sub.getSubTotalAmmount().getValue());
        List<JSONAggregateItem> items = sub
            .getItems()
            .stream()
            .map(this::convertModelToJSONModel)
            .collect(Collectors.toList());
        subItem.setItems(items);
        return subItem;
    }

    /**
     * 月別集計データ（13月）を作成
     *
     * @param subItems 月別データ
     * @param totalAmount 総額
     * @return 月別集計データ
     */
    private JSONSubAggregate createMonthlyAggregateItem(
        List<JSONSubAggregate> subItems,
        int totalAmount
    ) {
        JSONSubAggregate subSumItem = new JSONSubAggregate();
        subSumItem.setMonth(13);
        subSumItem.setSubTotalAmmount(totalAmount);

        List<JSONAggregateItem> aggregateItems = this.categoryService.getAll().getItems()
            .stream()
            .map(category -> calculateCategoryTotal(category, subItems))
            .collect(Collectors.toList());
        subSumItem.setItems(aggregateItems);
        return subSumItem;
    }

    /**
     * カテゴリごとの合計金額を計算
     *
     * @param category カテゴリ
     * @param subItems 月別データ
     * @return 計算されたカテゴリ集計アイテム
     */
    private JSONAggregateItem calculateCategoryTotal(
        Category category,
        List<JSONSubAggregate> subItems
    ) {
        JSONAggregateItem aggregateItem = new JSONAggregateItem();
        aggregateItem.setCategoryId(category.getId().toString());
        aggregateItem.setCategoryName(category.getName());

        int totalAmount = subItems
            .stream()
            .flatMap(sub -> sub.getItems().stream())
            .filter(item ->
                item.getCategoryId().equals(category.getId().getId())
            )
            .mapToInt(JSONAggregateItem::getCategoryAmmount)
            .sum();

        aggregateItem.setCategoryAmmount(totalAmount);
        return aggregateItem;
    }

    public JSONAggregateItem convertModelToJSONModel(AggregateItem model) {
        JSONAggregateItem converted = new JSONAggregateItem();
        converted.setCategoryId(model.getCategory().getId().getId());
        converted.setCategoryName(model.getCategory().getName());
        converted.setCategoryAmmount(model.getCategoryAmmount().getValue());
        return converted;
    }
}
