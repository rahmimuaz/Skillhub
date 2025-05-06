package com.skillhub.skillhub.controller;

import com.skillhub.skillhub.model.Post;
import com.skillhub.skillhub.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService service;

    @GetMapping
    public List<Post> getAllPosts() {
        return service.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = service.getPostById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUserId(@PathVariable String userId) {
        return service.getPostsByUserId(userId);
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        logger.info("Received post creation request: {}", post);
        try {
            Post createdPost = service.createPost(post);
            logger.info("Successfully created post: {}", createdPost);
            return createdPost;
        } catch (Exception e) {
            logger.error("Error creating post: ", e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        Post post = service.updatePost(id, updatedPost);
        return post != null ? ResponseEntity.ok(post) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        service.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}