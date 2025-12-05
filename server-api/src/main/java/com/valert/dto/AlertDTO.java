package com.valert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertDTO {
    private String severity; // RED, YELLOW, BLUE
    private String message;
    private String timestamp;
    private String location;
}
