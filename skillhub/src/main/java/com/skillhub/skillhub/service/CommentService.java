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

    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public Comment createReply(String parentCommentId, Comment reply) {
        Optional<Comment> parentComment = commentRepository.findById(parentCommentId);
        if (parentComment.isPresent()) {
            reply.setParentCommentId(parentCommentId);
            reply.setPostId(parentComment.get().getPostId());
            Comment savedReply = commentRepository.save(reply);
            
            // Add reply to parent's replies list
            Comment parent = parentComment.get();
            parent.getReplies().add(savedReply);
            commentRepository.save(parent);
            
            return savedReply;
        }
        throw new RuntimeException("Parent comment not found");
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public List<Comment> getTopLevelComments(String postId) {
        return commentRepository.findTopLevelComments(postId);
    }

    public List<Comment> getReplies(String parentCommentId) {
        return commentRepository.findByParentCommentId(parentCommentId);
    }

    public Comment updateComment(String id, Comment updatedComment) {
        Optional<Comment> existingComment = commentRepository.findById(id);
        if (existingComment.isPresent()) {
            Comment comment = existingComment.get();
            comment.setText(updatedComment.getText());
            comment.setEdited(true);
            return commentRepository.save(comment);
        }
        throw new RuntimeException("Comment not found");
    }

    public void deleteComment(String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            // If it's a reply, remove it from parent's replies
            if (comment.get().getParentCommentId() != null) {
                Optional<Comment> parentComment = commentRepository.findById(comment.get().getParentCommentId());
                if (parentComment.isPresent()) {
                    Comment parent = parentComment.get();
                    parent.getReplies().removeIf(reply -> reply.getId().equals(id));
                    commentRepository.save(parent);
                }
            }
            commentRepository.deleteById(id);
        }
    }

    public void deleteCommentsByPostId(String postId) {
        commentRepository.deleteByPostId(postId);
    }
}