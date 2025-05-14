package com.skillhub.skillhub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "posts") // Maps this class to the "posts" collection in MongoDB
public class Post {

    @Id
    private String id; // Unique identifier for the post (MongoDB document ID)

    private String userId; // ID of the user who created the post (foreign key reference)

    private String postType; // Type or category of the post (e.g., Programming, Cooking, etc.)

    private String title; // Title of the post

    private String description; // Main content/description of the post

    private List<String> images; // List of image URLs associated with the post

    private List<String> videos; // List of video URLs associated with the post

    private int visibilityCount; // Number of times the post has been viewed

    private LocalDateTime timestamp; // Date and time when the post was created

    // Default constructor initializes the timestamp with current time
    public Post() {
        this.timestamp = LocalDateTime.now();
    }

    // Parameterized constructor to quickly create a Post object with all fields
    public Post(String userId, String postType, String title, String description, 
                List<String> images, List<String> videos, int visibilityCount) {
        this.userId = userId;
        this.postType = postType;
        this.title = title;
        this.description = description;
        this.images = images;
        this.videos = videos;
        this.visibilityCount = visibilityCount;
        this.timestamp = LocalDateTime.now(); // Set timestamp at creation
    }

    // Getters and Setters for all fields

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
