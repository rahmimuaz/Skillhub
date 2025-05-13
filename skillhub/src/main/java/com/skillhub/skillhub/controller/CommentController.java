package com.skillhub.skillhub.controller;

import com.skillhub.skillhub.model.Comment;
import com.skillhub.skillhub.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.createComment(comment));
    }

    @PostMapping("/{parentId}/reply")
    public ResponseEntity<Comment> createReply(
            @PathVariable String parentId,
            @RequestBody Comment reply) {
        return ResponseEntity.ok(commentService.createReply(parentId, reply));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @GetMapping("/post/{postId}/top-level")
    public ResponseEntity<List<Comment>> getTopLevelComments(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getTopLevelComments(postId));
    }

    @GetMapping("/{parentId}/replies")
    public ResponseEntity<List<Comment>> getReplies(@PathVariable String parentId) {
        return ResponseEntity.ok(commentService.getReplies(parentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String id,
            @RequestBody Comment updatedComment) {
        return ResponseEntity.ok(commentService.updateComment(id, updatedComment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteCommentsByPostId(@PathVariable String postId) {
        commentService.deleteCommentsByPostId(postId);
        return ResponseEntity.ok().build();
    }
}