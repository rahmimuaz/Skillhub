package com.skillhub.skillhub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillhub.skillhub.model.Post;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
}