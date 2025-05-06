package com.skillhub.skillhub.repository;

import com.skillhub.skillhub.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findBySharedWithUserIdsContaining(String userId);
}