package com.valert.controller;

import com.valert.dto.AlertDTO;
import com.valert.service.DisasterAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*") // Allow all origins for development
public class DisasterAlertController {

    private final DisasterAlertService alertService;

    @Autowired
    public DisasterAlertController(DisasterAlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/latest")
    public AlertDTO getLatestAlert() {
        return alertService.getLatestAlert();
    }
}
