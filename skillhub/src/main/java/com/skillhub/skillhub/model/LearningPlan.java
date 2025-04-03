package com.skillhub.skillhub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "learningPlans")
public class LearningPlan {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private Date createdDate;
    private Date targetCompletionDate;
    private List<Topic> topics;
    private List<String> sharedWithUserIds;

    // Constructors, getters, and setters
    public LearningPlan() {}

    public LearningPlan(String userId, String title, String description, Date targetCompletionDate) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.createdDate = new Date();
        this.targetCompletionDate = targetCompletionDate;
    }

    // Getters and setters for all fields
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Date getCreatedDate() { return createdDate; }
    public void setCreatedDate(Date createdDate) { this.createdDate = createdDate; }
    public Date getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(Date targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }
    public List<Topic> getTopics() { return topics; }
    public void setTopics(List<Topic> topics) { this.topics = topics; }
    public List<String> getSharedWithUserIds() { return sharedWithUserIds; }
    public void setSharedWithUserIds(List<String> sharedWithUserIds) { this.sharedWithUserIds = sharedWithUserIds; }
}