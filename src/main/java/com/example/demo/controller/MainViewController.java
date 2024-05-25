package com.example.demo.controller;

import java.time.LocalDate;
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

import com.example.demo.model.JSONTotalAggregate;
import com.example.demo.service.AggregateService;
import com.example.demo.service.CategoryService;

@Controller
public class MainViewController {
    @Autowired
    CategoryService categoryService;

    @Autowired
    AggregateService aggregateService;

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
        JSONTotalAggregate found = aggregateService.convertModelToJSONModel(aggregateService.getAnnualy(year));
        return new ResponseEntity<>(found, HttpStatus.OK);
    }
}
