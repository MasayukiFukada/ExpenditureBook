package com.example.demo.controller;

import com.example.demo.model.Categories;
import com.example.demo.model.Category;
import com.example.demo.model.Expenditure;
import com.example.demo.model.JSONExpenditure;
import com.example.demo.primitive.ExpenditureDate;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.ItemNote;
import com.example.demo.primitive.Money;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ExpenditureService;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class EditViewController {

    @Autowired
    CategoryService categoryService;

    @Autowired
    ExpenditureService expenditureService;

    // SpringBoot で JSON を返す参考資料
    // https://qiita.com/take_ksk/items/845dfe496b2d4e6baac3
    // ResponseBody のアノテーション付ける
    // ResponseEntity を返す

    @PostMapping("/expenditure_filter")
    @ResponseBody
    public ResponseEntity<List<JSONExpenditure>> search(
        @RequestBody Map<String, String> body
    ) {
        List<JSONExpenditure> found = expenditureService
            .retrieve(
                Integer.valueOf(body.get("year")),
                Integer.valueOf(body.get("month"))
            )
            .getItems()
            .stream()
            .map(item -> expenditureService.convertModelToJSONModel(item))
            .collect(Collectors.toList());
        return new ResponseEntity<>(found, HttpStatus.OK);
    }

    @PostMapping("/expenditure_update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> appendItem(
        @RequestBody Map<String, String> body
    ) {
        Map<String, Object> response = new java.util.HashMap<>();
        boolean isSuccess = executeExpenditureUpdate(body);
        response.put("status", isSuccess);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 支出情報の更新処理を実行
     *
     * @param body リクエストボディ
     * @return 成功したかどうか
     */
    private boolean executeExpenditureUpdate(Map<String, String> body) {
        if (!isValidDate(body.get("date"))) {
            return false;
        }

        Expenditure model = buildExpenditure(body);
        if (model == null) {
            return false;
        }

        return saveExpenditure(model, body.get("id"));
    }

    /**
     * 日付の妥当性をチェック
     *
     * @param date 日付文字列
     * @return 有効な日付の場合true
     */
    private boolean isValidDate(String date) {
        return date != null && !date.isEmpty();
    }

    /**
     * Expenditureオブジェクトを構築
     *
     * @param body リクエストボディ
     * @return 構築されたExpenditureオブジェクト、バリデーションエラーの場合null
     */
    private Expenditure buildExpenditure(Map<String, String> body) {
        Expenditure model = new Expenditure();

        // IDを設定
        setExpenditureId(model, body.get("id"));

        // 日付を設定
        LocalDate parsed = LocalDate.parse(
            body.get("date"),
            DateTimeFormatter.ISO_LOCAL_DATE
        );
        model.setDate(new ExpenditureDate(parsed));

        // カテゴリを設定
        Category foundCategory = categoryService.getCategoryById(
            body.get("category")
        );
        if (!isCategoryValid(foundCategory)) {
            return null;
        }
        model.setCategory(foundCategory);

        // 金額とメモを設定
        model.setAmmount(new Money(Integer.valueOf(body.get("ammount"))));
        model.setNote(new ItemNote(body.get("note")));

        return model;
    }

    /**
     * ExpenditureのIDを設定
     *
     * @param model Expenditureオブジェクト
     * @param idValue IDの値
     */
    private void setExpenditureId(Expenditure model, String idValue) {
        if (idValue == null || idValue.isEmpty()) {
            ID newID = new ID();
            newID.setNewVer7ID();
            model.setId(newID);
        } else {
            model.setId(new ID(idValue));
        }
    }

    /**
     * カテゴリが有効かチェック
     *
     * @param category カテゴリオブジェクト
     * @return 有効なカテゴリの場合true
     */
    private boolean isCategoryValid(Category category) {
        return (
            category != null &&
            category.getId() != null &&
            category.getId().getId().length() > 0
        );
    }

    /**
     * Expenditureを保存
     *
     * @param model Expenditureオブジェクト
     * @param id ID値
     * @return 保存に成功した場合true
     */
    private boolean saveExpenditure(Expenditure model, String id) {
        if (id == null || id.isEmpty()) {
            return expenditureService.insert(model);
        } else {
            return expenditureService.update(model);
        }
    }

    @PostMapping("/expenditure_delete")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteItem(
        @RequestBody Map<String, String> body
    ) {
        Map<String, Object> response = new java.util.HashMap<>();
        boolean isSuccess = expenditureService.delete(body.get("id"));
        response.put("status", isSuccess);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
