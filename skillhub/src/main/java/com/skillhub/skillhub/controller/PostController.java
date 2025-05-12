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

@RestController  // Marks this class as a REST controller, making it capable of handling HTTP requests.
@RequestMapping("/api/posts")// Sets the base URL path for all endpoints in this controller.
public class PostController {
   
     // Logger for logging information and errors
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired // Automatically injects the PostService dependency
    private PostService service;
    

    // GET /api/posts
    // Returns a list of all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return service.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = service.getPostById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    // GET /api/posts/user/{userId}
    // Returns all posts created by a specific user

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUserId(@PathVariable String userId) {
        return service.getPostsByUserId(userId);
    }

    // POST /api/posts
    // Creates a new post

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