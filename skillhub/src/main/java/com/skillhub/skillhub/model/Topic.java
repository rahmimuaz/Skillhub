package com.skillhub.skillhub.model;

import java.util.List;

public class Topic {
    private String name;
    private boolean completed;
    private List<Resource> resources;
    private String notes;

    // Constructors, getters, and setters
    public Topic() {}

    public Topic(String name) {
        this.name = name;
        this.completed = false;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public List<Resource> getResources() { return resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}