package com.skillhub.skillhub.service;

import com.skillhub.skillhub.model.Course;
import com.skillhub.skillhub.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course enrollCourse(String courseId) {
        return courseRepository.findById(courseId).orElse(null);
    }

    public Course updateProgress(String courseId, String taskName) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course != null) {
            course.getTasks().stream()
                .filter(task -> task.getName().equals(taskName))
                .findFirst()
                .ifPresent(task -> task.setCompleted(true));

            long completedTasks = course.getTasks().stream().filter(t -> t.isCompleted()).count();
            int percentage = (int)((completedTasks * 100) / course.getTasks().size());
            course.setCompletionPercentage(percentage);

            courseRepository.save(course);
        }
        return course;
    }
}
