package com.valert.service;

import com.valert.dto.AlertDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class DisasterAlertService {

    @Value("${api.disaster.url}")
    private String apiUrl;

    @Value("${api.disaster.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public DisasterAlertService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AlertDTO getLatestAlert() {
        if ("YOUR_API_KEY_HERE".equals(apiKey)) {
            return getMockAlert();
        }

        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("ServiceKey", apiKey)
                    .queryParam("type", "json")
                    .queryParam("pageNo", "1")
                    .queryParam("numOfRows", "1")
                    .build()
                    .toUri();

            // The API Key is often already encoded, so we might need to handle it
            // carefully.
            // For now, we assume the user provides a Decoding Key which is safe for URI
            // construction.
            // If using Encoding Key, we might need to append it manually string-wise.

            String response = restTemplate.getForObject(uri, String.class);
            JsonNode root = objectMapper.readTree(response);

            JsonNode row = root.path("DisasterMsg").path(1).path("row");
            if (row.isArray() && row.size() > 0) {
                JsonNode firstAlert = row.get(0);
                String msg = firstAlert.path("msg").asText();
                String location = firstAlert.path("location_name").asText();
                String createDate = firstAlert.path("create_date").asText();

                // Simple logic to determine severity based on keywords
                String severity = "YELLOW"; // Default
                if (msg.contains("경보") || msg.contains("대피") || msg.contains("위험")) {
                    severity = "RED";
                } else if (msg.contains("주의보")) {
                    severity = "YELLOW";
                } else {
                    severity = "BLUE";
                }

                return new AlertDTO(
                        severity,
                        msg,
                        createDate,
                        location);
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback to mock if error
        }

        return getMockAlert();
    }

    private AlertDTO getMockAlert() {
        return new AlertDTO(
                "RED",
                "[MOCK] Heavy Rain Warning in Seoul. Please refrain from going out and stay safe.",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                "Seoul, Korea");
    }
}
