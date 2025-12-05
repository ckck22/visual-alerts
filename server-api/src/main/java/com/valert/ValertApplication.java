package com.valert;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ValertApplication {

    public static void main(String[] args) {
        SpringApplication.run(ValertApplication.class, args);
    }

}
