package com.valert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertPayloadDTO {
    private String severity; // RED, YELLOW, BLUE
    private String message;
    private String hapticPattern;
    private String timestamp;
}
