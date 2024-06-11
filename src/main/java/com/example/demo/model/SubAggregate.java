package com.example.demo.model;

import java.io.Serializable;
import java.util.List;

import com.example.demo.primitive.Money;
import com.example.demo.primitive.Month;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubAggregate implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    private List<AggregateItem> items;
    private Month month;
    private Money subTotalAmmount = new Money(0);

    public SubAggregate(int month) {
        this.month = new Month(month);
    }

    public SubAggregate(List<AggregateItem> arg) {
        this.items = arg;
    }

    public void append(Expenditure item) {
        for (AggregateItem data : this.items) {
            if (data.getCategory().getId().getId().equals(item.getCategory().getId().getId())) {
                int sum = data.getCategoryAmmount().getValue() + item.getAmmount().getValue();
                Money sumAmmount = new Money(sum);
                data.setCategoryAmmount(sumAmmount);
            }
        }
        subTotalAmmount = new Money(subTotalAmmount.getValue() + item.getAmmount().getValue());
    }
}
