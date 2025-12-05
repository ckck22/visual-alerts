package com.valert.controller;

import com.valert.dto.AlertPayloadDTO;
import com.valert.service.AlertAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulate")
public class SimulationController {

    private final AlertAnalysisService alertAnalysisService;

    @Autowired
    public SimulationController(AlertAnalysisService alertAnalysisService) {
        this.alertAnalysisService = alertAnalysisService;
    }

    @PostMapping("/{type}")
    public AlertPayloadDTO triggerSimulation(@PathVariable String type) {
        String message = "Simulation: " + type;
        // Map type to a mock message for analysis
        if ("earthquake".equalsIgnoreCase(type)) {
            message = "Emergency: Earthquake detected in the area.";
        } else if ("missing".equalsIgnoreCase(type)) {
            message = "Alert: Missing person reported.";
        }
        
        return alertAnalysisService.determineSeverity(message);
    }
}
