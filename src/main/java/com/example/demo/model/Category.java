package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.StringJoiner;

import com.example.demo.primitive.CategoryNote;
import com.example.demo.primitive.ID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Category {
    private ID id;
    private int type;
    private String name;
    private CategoryNote note;
    private boolean is_enable;
    private int sort_order_no;
    private LocalDateTime create_at;
    private LocalDateTime update_at;

    public Category() {
    }

    public Category(int type, String name, CategoryNote note) {
        this.id = new ID();
        this.id.setNewVer4ID();
        this.type = type;
        this.name = name;
        this.note = note;
    }

    @Override
    public String toString() {
        StringJoiner result = new StringJoiner(",");
        result.add("【カテゴリ】");
        result.add("ID: " + this.id.getId());
        result.add("TYPE: " + this.type);
        result.add("NAME: " + this.name);
        result.add("NOTE: " + this.note.getNote());
        result.add("SORT_ORDER: " + this.sort_order_no);
        result.add("IS_ENABLE: " + this.is_enable);
        result.add("CREATE_AT: " + this.create_at);
        result.add("UPDATE_AT: " + this.update_at);
        return result.toString();
    }
}
