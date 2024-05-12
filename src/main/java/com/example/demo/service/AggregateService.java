package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.model.TotalAggregate;

@Service
public class AggregateService {
    public TotalAggregate getAnnualy(int year) {
        return new TotalAggregate();
    }

    public TotalAggregate getMonthly(int year, int month) {
        return new TotalAggregate();
    }
}
