package com.skillhub.skillhub.service;

import com.skillhub.skillhub.model.Post;
import com.skillhub.skillhub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    // Injecting the PostRepository to interact with the database
    @Autowired
    private PostRepository repository;

    /**
     * Retrieves all posts from the database.
     * @return List of all Post entries.
     */
    public List<Post> getAllPosts() {
        return repository.findAll();
    }

    /**
     * Retrieves a specific post by its unique ID.
     * @param id The ID of the post.
     * @return An Optional containing the Post if found, or empty if not.
     */
    public Optional<Post> getPostById(String id) {
        return repository.findById(id);
    }

    /**
     * Retrieves all posts created by a specific user.
     * @param userId The ID of the user.
     * @return List of Post entries created by the given user.
     */
    public List<Post> getPostsByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    /**
     * Creates and saves a new post.
     * @param post The Post object to be saved.
     * @return The saved Post object.
     */
    public Post createPost(Post post) {
        return repository.save(post);
    }

    /**
     * Updates an existing post.
     * If the post with the given ID exists, it updates it with the new data; otherwise, returns null.
     * @param id The ID of the post to update.
     * @param updatedPost The updated Post object.
     * @return The updated Post object, or null if the post does not exist.
     */
    public Post updatePost(String id, Post updatedPost) {
        if (repository.existsById(id)) {
            updatedPost.setId(id);
            return repository.save(updatedPost);
        }
        return null;
    }

    /**
     * Deletes a post by its ID.
     * @param id The ID of the post to delete.
     */
    public void deletePost(String id) {
        repository.deleteById(id);
    }
}
