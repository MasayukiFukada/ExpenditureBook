package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Category")
public class CategoryEntity {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "type")
    private int type;

    @Column(name = "name")
    private String name;

    @Column(name = "note")
    private String note;

    @Column(name = "is_enable")
    private boolean is_enable;

    // NOTE:
    // 変数名にアンダースコアを含むとソート処理をリポジトリに生成するのに失敗する
    // カラム名には含んでも良いが、エンティティ側には含めないように。
    @Column(name = "sort_order_no")
    private int sortOrderNo;

    @Column(name = "create_at")
    private LocalDateTime create_at;

    @Column(name = "update_at")
    private LocalDateTime update_at;
}
