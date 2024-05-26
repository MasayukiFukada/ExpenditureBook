package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JSONCSVResult {
    // MEMO: メンバ変数無しだと 406 not Acceptable が出る

    boolean result = false;
}
