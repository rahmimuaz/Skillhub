package com.skillhub.skillhub.service;

import com.skillhub.skillhub.model.LearningPlan;
import com.skillhub.skillhub.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public List<LearningPlan> getUserLearningPlans(String userId) {
        return learningPlanRepository.findByUserId(userId);
    }

    public List<LearningPlan> getSharedLearningPlans(String userId) {
        return learningPlanRepository.findBySharedWithUserIdsContaining(userId);
    }

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan learningPlan) {
        learningPlan.setId(id);
        return learningPlanRepository.save(learningPlan);
    }

    public void deleteLearningPlan(String id) {
        learningPlanRepository.deleteById(id);
    }

    public LearningPlan shareLearningPlan(String id, List<String> userIds) {
        Optional<LearningPlan> optionalPlan = learningPlanRepository.findById(id);
        if (optionalPlan.isPresent()) {
            LearningPlan plan = optionalPlan.get();
            plan.setSharedWithUserIds(userIds);
            return learningPlanRepository.save(plan);
        }
        return null;
    }

    public LearningPlan getLearningPlanById(String id) {
        return learningPlanRepository.findById(id).orElse(null);
    }
}