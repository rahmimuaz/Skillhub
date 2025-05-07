package com.skillhub.skillhub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;
    private String userId; // Foreign key reference to User
    private String postType;
    private String title;
    private String description;
    private List<String> images; // Changed from single image to list of images
    private List<String> videos; // Added videos field
    private int visibilityCount;
    private LocalDateTime timestamp;

    // Constructors
    public Post() {
        this.timestamp = LocalDateTime.now(); // Set default timestamp
    }

    public Post(String userId, String postType, String title, String description, 
                List<String> images, List<String> videos, int visibilityCount) {
        this.userId = userId;
        this.postType = postType;
        this.title = title;
        this.description = description;
        this.images = images;
        this.videos = videos;
        this.visibilityCount = visibilityCount;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPostType() { return postType; }
    public void setPostType(String postType) { this.postType = postType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public List<String> getVideos() { return videos; }
    public void setVideos(List<String> videos) { this.videos = videos; }

    public int getVisibilityCount() { return visibilityCount; }
    public void setVisibilityCount(int visibilityCount) { this.visibilityCount = visibilityCount; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}