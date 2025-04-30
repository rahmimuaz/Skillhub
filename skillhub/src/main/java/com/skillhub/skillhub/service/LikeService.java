package com.skillhub.skillhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillhub.skillhub.model.Post;
import com.skillhub.skillhub.repository.PostRepository;

import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private PostRepository postRepository;

    public String likePost(String postId, String userId) {
        if (postId == null || postId.isEmpty() || userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("Post ID and User ID cannot be null or empty");
        }

        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isEmpty()) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }

        Post post = optionalPost.get();

        synchronized (post) {
            if (post.getLikedUserIds().contains(userId)) {
                throw new IllegalStateException("User already liked the post");
            }

            post.getLikedUserIds().add(userId);
            postRepository.save(post);
        }

        return "Post liked successfully";
    }

    public String unlikePost(String postId, String userId) {
        if (postId == null || postId.isEmpty() || userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("Post ID and User ID cannot be null or empty");
        }

        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isEmpty()) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }

        Post post = optionalPost.get();

        synchronized (post) {
            if (!post.getLikedUserIds().contains(userId)) {
                throw new IllegalStateException("User has not liked the post");
            }

            post.getLikedUserIds().remove(userId);
            postRepository.save(post);
        }

        return "Post unliked successfully";
    }

    public int getLikeCount(String postId) {
        if (postId == null || postId.isEmpty()) {
            throw new IllegalArgumentException("Post ID cannot be null or empty");
        }

        return postRepository.findById(postId) // Fixed the incorrect static access
                .map(post -> post.getLikedUserIds().size())
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));
    }
}

