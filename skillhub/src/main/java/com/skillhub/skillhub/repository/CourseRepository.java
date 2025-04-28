package com.skillhub.skillhub.repository;


import com.skillhub.skillhub.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {
}
