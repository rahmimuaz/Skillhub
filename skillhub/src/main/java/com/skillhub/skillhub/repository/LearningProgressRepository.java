package com.skillhub.skillhub.repository;

import com.skillhub.skillhub.model.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
    List<LearningProgress> findByPlanId(String planId);
}