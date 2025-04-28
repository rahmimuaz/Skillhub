package com.skillhub.skillhub.controller;


import  com.skillhub.skillhub.model.Course;
import com.skillhub.skillhub.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/enroll/{id}")
    public Course enrollCourse(@PathVariable String id) {
        return courseService.enrollCourse(id);
    }

    @PostMapping("/updateProgress/{id}")
    public Course updateProgress(@PathVariable String id, @RequestParam String taskName) {
        return courseService.updateProgress(id, taskName);
    }
}
