package com.valert.service;

import com.valert.dto.AlertDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class DisasterAlertService {

    private static final Logger logger = LoggerFactory.getLogger(DisasterAlertService.class);

    @Value("${api.disaster.url}")
    private String apiUrl;

    @Value("${api.disaster.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private volatile AlertDTO cachedAlert;

    public DisasterAlertService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.cachedAlert = getMockAlert(); // Initialize with mock
    }

    // Fetch every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void fetchLatestAlert() {
        if ("YOUR_API_KEY_HERE".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            logger.warn("API Key is not configured. Using mock data.");
            return;
        }

        try {
            logger.info("Fetching latest disaster alert from API...");
            URI uri = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("ServiceKey", apiKey)
                    .queryParam("type", "json")
                    .queryParam("pageNo", "1")
                    .queryParam("numOfRows", "1")
                    .build()
                    .toUri();

            // Note: The apiKey provided might be already encoded or not.
            // UriComponentsBuilder encodes by default. If the key is 'Decoding' key, it
            // works.
            // If it is 'Encoding' key, it might get double encoded.
            // We'll assume it works for now.

            String response = restTemplate.getForObject(uri, String.class);
            JsonNode root = objectMapper.readTree(response);

            // Structure: {"DisasterMsg": [{"head": ...}, {"row": [...]}]}
            JsonNode row = root.path("DisasterMsg").path(1).path("row");

            if (row.isMissingNode()) {
                // Sometimes structure might be different or error response
                logger.debug("Response structure check: {}", response);
            }

            if (row.isArray() && row.size() > 0) {
                JsonNode firstAlert = row.get(0);
                String msg = firstAlert.path("msg").asText();
                String location = firstAlert.path("location_name").asText();
                String createDate = firstAlert.path("create_date").asText();

                String severity = determineSeverity(msg);

                this.cachedAlert = new AlertDTO(
                        severity,
                        msg,
                        createDate,
                        location);
                logger.info("Successfully updated cached alert: {}", msg);
            } else {
                logger.info("No alerts found in response or invalid structure.");
            }
        } catch (Exception e) {
            logger.error("Error fetching disaster alert", e);
            // We keep the old cachedAlert in case of error
        }
    }

    public AlertDTO getLatestAlert() {
        return cachedAlert;
    }

    private String determineSeverity(String msg) {
        if (msg.contains("경보") || msg.contains("대피") || msg.contains("위험")) {
            return "RED";
        } else if (msg.contains("주의보")) {
            return "YELLOW";
        }
        return "BLUE";
    }

    private AlertDTO getMockAlert() {
        return new AlertDTO(
                "RED",
                "[MOCK] Fire Alert in Seoul. Please evacuate immediately.",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                "Seoul, Korea");
    }
}
