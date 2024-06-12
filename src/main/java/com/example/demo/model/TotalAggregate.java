package com.example.demo.model;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;

import com.example.demo.primitive.Money;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TotalAggregate implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    private List<SubAggregate> items = new ArrayList<SubAggregate>();
    private Money totalAmmount = new Money(0);

    public TotalAggregate() {
    }

    public void Initialize(Categories categories) {
        for (int i = 1; i <= 12; i++) {
            // i 月のサブ合計
            SubAggregate item = new SubAggregate(i);
            // カテゴリ一覧を追加
            List<AggregateItem> aggregates = new ArrayList<AggregateItem>();
            for (Category category : categories.getItems()) {
                AggregateItem aggregate = new AggregateItem(category);
                aggregates.add(aggregate);
            }
            item.setItems(aggregates);
            this.items.add(item);
        }
        this.setItems(items);
    }

    /**
     * 支出情報を追加
     * 
     * @param item 追加したい項目
     */
    public void append(Expenditure item) {
        for (SubAggregate sub : this.items) {
            if (sub.getMonth().getValue() == item.getDate().getDate().getMonthValue()) {
                sub.append(item);
                totalAmmount = new Money(totalAmmount.getValue() + item.getAmmount().getValue());
            }
        }
    }

    /**
     * ディープコピー
     * 
     * @return
     */
    public TotalAggregate copy() {
        TotalAggregate copy;

        ByteArrayOutputStream bis = null;
        ObjectOutputStream ios = null;
        ByteArrayInputStream bos = null;
        ObjectInputStream oos = null;
        try {
            // オブジェクトをバイト配列にシリアライズ
            bis = new ByteArrayOutputStream();
            ios = new ObjectOutputStream(bis);
            ios.writeObject(this);
            ios.flush();
            ios.close();

            // バイト配列からオブジェクトにデシリアライズ( = ディープコピー )
            bos = new ByteArrayInputStream(bis.toByteArray());
            oos = new ObjectInputStream(bos);
            copy = (TotalAggregate) oos.readObject();

            bis.close();
            ios.close();
            bos.close();
            oos.close();
        } catch (Exception e) {
            System.out.println("▲ 例外 ▲: ディープコピーに失敗");
            System.out.println(e);
            copy = new TotalAggregate();
        }
        return copy;
    }
}
