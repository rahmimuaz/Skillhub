package com.skillhub.skillhub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "learningProgress")
public class LearningProgress {

    @Id
    private String id; 
    private String userId;  // Reference to User
    private String planId;  // Reference to Plan
    private String lessonId;
    private int completionProgress; // Percentage 0-100
    private String status;  // "In Progress" or "Completed"
    private LocalDateTime timestamp;


    // Constructors
    public LearningProgress() {}

    public LearningProgress(String userId, String planId, String lessonId, int completionProgress, String status, LocalDateTime timestamp) {
        this.userId = userId;
        this.planId = planId;
        this.lessonId = lessonId;
        this.completionProgress = completionProgress;
        this.status = status;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }

    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }

    public int getCompletionProgress() { return completionProgress; }
    public void setCompletionProgress(int completionProgress) { this.completionProgress = completionProgress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}