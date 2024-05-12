package com.example.demo.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.example.demo.model.Categories;
import com.example.demo.model.Category;
import com.example.demo.model.Expenditure;
import com.example.demo.primitive.ExpenditureDate;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.ItemNote;
import com.example.demo.primitive.Money;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ExpenditureService;

@Controller
public class EditViewController {
    @Autowired
    CategoryService categoryService;

    @Autowired
    ExpenditureService expenditureService;

    @GetMapping(path = "/edit")
    public String editScreen(Model model) {
        LocalDate today = LocalDate.now();

        Categories categories = categoryService.getEnable();
        model.addAttribute("categoryMaster", categories.getItems());

        List<Integer> rangeYear = IntStream.rangeClosed(2024, today.getYear()).boxed().collect(Collectors.toList());
        model.addAttribute("yearSelect", rangeYear);

        List<Integer> rangeMonth = IntStream.rangeClosed(1, 12).boxed().collect(Collectors.toList());
        model.addAttribute("monthSelect", rangeMonth);

        return "edit.html";
    }

    @RequestMapping(value = "/expenditure_update", method = RequestMethod.POST)
    public String appendItem(@RequestBody Map<String, String> body) {
        // ちゃんと日付が入っていること
        if (body.get("date") != "") {
            Expenditure model = new Expenditure();
            final String getID = body.get("id");
            if (getID == "") {
                ID newID = new ID();
                newID.setNewVer7ID();
                model.setId(newID);
            } else {
                model.setId(new ID(getID));
            }
            LocalDate parsed = LocalDate.parse(body.get("date"), DateTimeFormatter.ISO_LOCAL_DATE);
            model.setDate(new ExpenditureDate(parsed));
            Category foundCategory = categoryService.getCategoryById(body.get("category"));
            if (foundCategory.getId().getId().length() > 0) {
                // カテゴリがちゃんと見つかっていたら続ける
                model.setCategory(foundCategory);
                model.setAmmount(new Money(Integer.valueOf(body.get("ammount"))));
                model.setNote(new ItemNote(body.get("note")));
                expenditureService.insert(model);
            }
        }
        return "edit.html";
    }
}
