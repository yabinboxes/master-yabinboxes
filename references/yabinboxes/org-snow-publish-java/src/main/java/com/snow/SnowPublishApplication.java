package com.snow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SnowPublishApplication {

    public static void main(String[] args) {
        SpringApplication.run(SnowPublishApplication.class, args);
    }
}
