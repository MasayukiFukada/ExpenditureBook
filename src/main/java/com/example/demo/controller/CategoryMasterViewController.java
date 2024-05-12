package com.example.demo.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.example.demo.model.Categories;
import com.example.demo.model.Category;
import com.example.demo.primitive.CategoryNote;
import com.example.demo.primitive.ID;
import com.example.demo.service.CategoryService;

@Controller
public class CategoryMasterViewController {
    @Autowired
    CategoryService categoryService;

    @GetMapping(path = "/category_master")
    public String categoryMaster(Model model) {
        Categories categories = categoryService.getAll();
        model.addAttribute("categoryMaster", categories.getItems());
        return "category_master.html";
    }

    // フォームから JSON で受け取るのは Map
    @RequestMapping(value = "/category_update", method = RequestMethod.POST)
    public String categoryAppend(@RequestBody Map<String, String> body) {
        Category model = new Category();
        final String getID = body.get("id");
        if (getID == "") {
            ID newID = new ID();
            newID.setNewVer4ID();
            model.setId(newID);
        } else {
            model.setId(new ID(getID));
        }
        model.setType(Integer.valueOf(body.get("type")));
        model.setName(body.get("name"));
        CategoryNote note = new CategoryNote(body.get("note"));
        model.setNote(note);
        model.setSort_order_no(Integer.valueOf(body.get("sort_order")));
        boolean enable = (body.get("is_enable") == "true");
        System.out.println("★★");
        System.out.println(body.get("is_enable"));
        System.out.println(enable);
        model.set_enable(enable);
        model.setUpdate_at(LocalDateTime.now());
        final String getCreateAt = body.get("create_at");
        if (getCreateAt.length() > 0) {
            LocalDateTime parsed = LocalDateTime.parse(getCreateAt, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            model.setCreate_at(parsed);
            categoryService.update(model);
        } else {
            categoryService.insert(model);
        }
        return "category_master.html";
    }
}
