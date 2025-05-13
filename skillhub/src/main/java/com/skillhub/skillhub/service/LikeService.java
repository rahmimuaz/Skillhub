package com.skillhub.skillhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillhub.skillhub.model.Post;
import com.skillhub.skillhub.repository.PostRepository;

import java.util.HashSet;
import java.util.Set;

@Service
public class LikeService {

    @Autowired
    private PostRepository postRepository;

    private Set<String> likedUserIds = new HashSet<>();

    public Set<String> getLikedUserIds() {
        return likedUserIds;
    }

    public void setLikedUserIds(Set<String> likedUserIds) {
        this.likedUserIds = likedUserIds;
    }

    @Transactional
    public String likePost(String postId, String userId) {
        if (postId == null || postId.isEmpty() || userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("Post ID and User ID cannot be null or empty");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        if (post.getLikedUserIds().contains(userId)) {
            throw new IllegalStateException("User already liked the post");
        }
        post.getLikedUserIds().add(userId);
        post.getLikedUserIds().add(userId);
        postRepository.save(post);

        return "Post liked successfully";
    }

    @Transactional
    public String unlikePost(String postId, String userId) {
        if (postId == null || postId.isEmpty() || userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("Post ID and User ID cannot be null or empty");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        if (!post.getLikedUserIds().contains(userId)) {
            throw new IllegalStateException("User has not liked the post");
        }

        post.getLikedUserIds().remove(userId);
        postRepository.save(post);

        return "Post unliked successfully";
    }

    public int getLikeCount(String postId) {
        if (postId == null || postId.isEmpty()) {
            throw new IllegalArgumentException("Post ID cannot be null or empty");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));
                
        return post.getLikedUserIds().size();
    }
}