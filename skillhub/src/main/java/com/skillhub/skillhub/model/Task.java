package com.skillhub.skillhub.model;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    private String name;
    private boolean completed;
}

