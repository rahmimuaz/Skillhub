package com.skillhub.skillhub.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.skillhub.skillhub.repository")
public class LearningTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(LearningTrackerApplication.class, args);
    }
}
