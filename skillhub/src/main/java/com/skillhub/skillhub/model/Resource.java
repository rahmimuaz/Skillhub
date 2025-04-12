package com.skillhub.skillhub.model;

public class Resource {
    private String type; // "book", "video", "article", etc.
    private String title;
    private String url;
    private String description;

    // Constructors, getters, and setters
    public Resource() {}

    public Resource(String type, String title, String url) {
        this.type = type;
        this.title = title;
        this.url = url;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}