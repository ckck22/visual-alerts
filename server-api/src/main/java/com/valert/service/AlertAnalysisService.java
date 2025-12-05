package com.valert.service;

import com.valert.dto.AlertPayloadDTO;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AlertAnalysisService {

    public AlertPayloadDTO determineSeverity(String rawMessage) {
        // TODO: Implement keyword analysis logic based on cognitive science research.
        // e.g., If message contains "Earthquake" -> Map to RED color, Heavy Pulse haptic pattern.
        // e.g., If message contains "Missing" -> Map to BLUE color, Steady haptic pattern.
        
        String severity = "BLUE";
        String hapticPattern = "Steady";
        
        if (rawMessage != null) {
            if (rawMessage.contains("Earthquake") || rawMessage.contains("Fire")) {
                severity = "RED";
                hapticPattern = "Heavy Pulse";
            } else if (rawMessage.contains("Rain") || rawMessage.contains("Snow")) {
                severity = "YELLOW";
                hapticPattern = "Medium Pulse";
            }
        }

        return new AlertPayloadDTO(severity, rawMessage, hapticPattern, LocalDateTime.now().toString());
    }
}
