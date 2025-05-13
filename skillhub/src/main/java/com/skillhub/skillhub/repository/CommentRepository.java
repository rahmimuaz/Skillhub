package com.skillhub.skillhub.repository;

import com.skillhub.skillhub.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    
    List<Comment> findByPostIdAndParentCommentIdIsNull(String postId);
    
    List<Comment> findByParentCommentId(String parentCommentId);
    
    @Query(value = "{ 'postId': ?0, 'parentCommentId': { $exists: false } }")
    List<Comment> findTopLevelComments(String postId);
    
    void deleteByPostId(String postId);
}