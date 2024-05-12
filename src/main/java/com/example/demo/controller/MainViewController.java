package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainViewController {
    @GetMapping(path = "/")
    public String mainView() {
        return "main.html";
    }
}
