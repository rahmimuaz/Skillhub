package com.skillhub.skillhub.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillhub.skillhub.model.Comment;
import com.skillhub.skillhub.repository.CommentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(String postId, Comment comment) {
        comment.setPostId(postId);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findAllByPostId(postId);
    }

    public Optional<Comment> getCommentById(String postId, String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        return comment.filter(c -> c.getPostId().equals(postId));
    }

    public Comment updateComment(String postId, String id, Comment updatedComment) {
        Comment existingComment = commentRepository.findById(id)
                .filter(c -> c.getPostId().equals(postId))
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id + " and postId: " + postId));

        existingComment.setText(updatedComment.getText());
        existingComment.setAuthor(updatedComment.getAuthor());
        return commentRepository.save(existingComment);
    }

    public void deleteComment(String postId, String id) {
        Comment existingComment = commentRepository.findById(id)
                .filter(c -> c.getPostId().equals(postId))
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id + " and postId: " + postId));

        commentRepository.deleteById(id);
    }
}
