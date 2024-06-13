package com.example.demo.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
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

import com.example.demo.model.Category;
import com.example.demo.model.Expenditure;
import com.example.demo.model.JSONCSVResult;
import com.example.demo.model.JSONMonthlyComment;
import com.example.demo.model.JSONTotalAggregate;
import com.example.demo.model.MonthlyComment;
import com.example.demo.model.MonthlyComments;
import com.example.demo.model.TotalAggregate;
import com.example.demo.primitive.CommentNote;
import com.example.demo.primitive.ExpenditureDate;
import com.example.demo.primitive.ID;
import com.example.demo.primitive.ItemNote;
import com.example.demo.primitive.Money;
import com.example.demo.primitive.Month;
import com.example.demo.primitive.Year;
import com.example.demo.service.AggregateService;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ExpenditureService;
import com.example.demo.service.MonthlyCommentService;

@Controller
public class MainViewController {
    @Autowired
    CategoryService categoryService;

    @Autowired
    AggregateService aggregateService;

    @Autowired
    ExpenditureService expenditureService;

    @Autowired
    MonthlyCommentService monthlyCommentService;

    @GetMapping(path = "/")
    public String mainView(Model model) {
        Calendar calendar = Calendar.getInstance();
        int thisYear = calendar.get(Calendar.YEAR);
        List<Integer> years = IntStream.rangeClosed(thisYear - 5, thisYear).boxed().collect(Collectors.toList());
        Collections.reverse(years);
        model.addAttribute("year", years);

        aggregateService.Initialize(categoryService);

        LocalDate today = LocalDate.now();
        model.addAttribute("currentYear", today.getYear());

        return "main.html";
    }

    @PostMapping("/aggregate_filter")
    @ResponseBody
    public ResponseEntity<JSONTotalAggregate> search(@RequestBody Map<String, String> body) {
        int year = Integer.valueOf(body.get("year"));
        TotalAggregate totalAggregate = aggregateService.getAnnualy(year);
        JSONTotalAggregate found = aggregateService.convertModelToJSONModel(totalAggregate);
        found.setTotalAmmount(totalAggregate.getTotalAmmount().getValue());
        return new ResponseEntity<>(found, HttpStatus.OK);
    }

    @PostMapping("/monthly_comments")
    @ResponseBody
    public ResponseEntity<List<JSONMonthlyComment>> getComments(@RequestBody Map<String, String> body) {
        int year;
        String receive = body.get("year");
        if (receive == "") {
            year = 0;
        } else {
            year = Integer.valueOf(receive);
        }
        return new ResponseEntity<>(fetchComments(year), HttpStatus.OK);
    }

    private List<JSONMonthlyComment> fetchComments(int year) {
        List<JSONMonthlyComment> found = new ArrayList<>();
        MonthlyComments comments = monthlyCommentService.getAnnualy(year);
        for (MonthlyComment item : comments.getItems()) {
            JSONMonthlyComment json = new JSONMonthlyComment();
            json.setId(item.getId().getId());
            json.setComment(item.getNote().getNote());
            json.setYear(item.getYear().getValue());
            json.setMonth(item.getMonth().getValue());
            found.add(json);
        }
        return found;
    }

    @PostMapping("/update_comment")
    @ResponseBody
    public ResponseEntity<List<JSONMonthlyComment>> updateComment(@RequestBody Map<String, String> body) {
        int year;
        String receive = body.get("year");
        if (receive == "") {
            year = 0;
        } else {
            year = Integer.valueOf(receive);
        }
        MonthlyComment comment = new MonthlyComment();
        comment.setYear(new Year(year));
        comment.setMonth(new Month(Integer.valueOf(body.get("month"))));
        CommentNote note = new CommentNote(body.get("note"));
        comment.setNote(note);
        if (body.get("id") == "") {
            ID newID = new ID();
            newID.setNewVer4ID();
            comment.setId(newID);
            monthlyCommentService.insert(comment);
        } else {
            ID alreadyID = new ID(body.get("id"));
            comment.setId(alreadyID);
            monthlyCommentService.update(comment);
        }
        return new ResponseEntity<>(fetchComments(year), HttpStatus.OK);
    }

    @PostMapping("/register_csv")
    @ResponseBody
    public ResponseEntity<JSONCSVResult> registerFromCSV(@RequestBody Map<String, String> body) {
        Expenditure newItem = new Expenditure();
        newItem.getId().setNewVer7ID(); // 新規で ID を振る
        newItem.setDate(
                new ExpenditureDate(
                        LocalDate.of(
                                Integer.valueOf(body.get("year")),
                                Integer.valueOf(body.get("month")),
                                Integer.valueOf(body.get("day")))));
        newItem.setAmmount(new Money(Integer.valueOf(body.get("ammount"))));
        Category tempCategory = new Category();
        tempCategory.setId(new ID(body.get("category_id"))); // とりあえず ID だけ
        newItem.setCategory(tempCategory);
        newItem.setNote(new ItemNote(body.get("note")));
        newItem.setCreate_at(LocalDateTime.now());
        newItem.setUpdate_at(LocalDateTime.now());

        JSONCSVResult result = new JSONCSVResult();
        result.setResult(expenditureService.insert(newItem));
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
