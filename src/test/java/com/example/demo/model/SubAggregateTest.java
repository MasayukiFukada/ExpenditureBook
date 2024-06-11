package com.example.demo.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.demo.primitive.ID;
import com.example.demo.primitive.Money;
import com.example.demo.primitive.Month;

class SubAggregateTest {

    @Test
    @DisplayName("通常のテスト")
    void newTest() {
        SubAggregate model = new SubAggregate(6);
        model.setMonth(new Month(6));

        assertThat(model.getMonth().getValue()).isEqualTo(6);
    }

    @Test
    @DisplayName("別のコンストラクタのテスト")
    void anotherConstructor() {
        List<AggregateItem> list = new ArrayList<AggregateItem>();
        SubAggregate model = new SubAggregate(list);

        assertThat(model.getItems()).isEqualTo(list);
    }

    @Test
    @DisplayName("あまり使わなそうな関数のテスト") // 生成されたもので関数自体消すかも
    void rareFunctionTest() {
        SubAggregate model = new SubAggregate(1);
        model.setSubTotalAmmount(new Money(123));
        List<AggregateItem> list = new ArrayList<AggregateItem>();
        model.setItems(list);

        assertThat(model.getSubTotalAmmount().getValue()).isEqualTo(123);
        assertThat(model.getItems()).isEqualTo(list);
    }

    @Test
    @DisplayName("計算のテスト")
    void calculatorTest() {
        List<AggregateItem> list = new ArrayList<AggregateItem>();
        list.add(new AggregateItem(getCategory("cat1")));
        list.add(new AggregateItem(getCategory("cat2")));
        SubAggregate model = new SubAggregate(list);

        model.append(getExpenditure("cat1", 100));
        model.append(getExpenditure("cat2", 200));

        assertThat(model.getItems().size()).isEqualTo(2);
        assertThat(model.getItems().get(0).getCategoryAmmount().getValue()).isEqualTo(100);
        assertThat(model.getItems().get(1).getCategoryAmmount().getValue()).isEqualTo(200);
        assertThat(model.getSubTotalAmmount().getValue()).isEqualTo(300);
    }

    private Expenditure getExpenditure(String name, int value) {
        Category category = new Category();
        ID id = new ID(name);
        category.setId(id);
        Expenditure result = new Expenditure();
        result.setCategory(category);
        result.setAmmount(new Money(value));
        return result;
    }

    private Category getCategory(String name) {
        Category category = new Category();
        ID id = new ID(name);
        category.setId(id);
        return category;
    }
}
