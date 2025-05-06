package com.skillhub.skillhub.controller;   
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.skillhub.skillhub.model.Comment;
import com.skillhub.skillhub.service.CommentService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{postId}")
    public Comment addComment(@PathVariable String postId, @RequestBody Comment comment) {
        return commentService.addComment(postId, comment);
    }

    @GetMapping("/{postId}")
    public List<Comment> getCommentsByPostId(@PathVariable String postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @GetMapping("/{postId}/{id}")
    public Optional<Comment> getCommentById(@PathVariable String postId, @PathVariable String id) {
        return commentService.getCommentById(postId, id);
    }

    @PutMapping("/{postId}/{id}")
    public Comment updateComment(@PathVariable String postId, @PathVariable String id, @RequestBody Comment comment) {
        return commentService.updateComment(postId, id, comment);
    }

    @DeleteMapping("/{postId}/{id}")
    public void deleteComment(@PathVariable String postId, @PathVariable String id) {
        commentService.deleteComment(postId, id);
    }
}
