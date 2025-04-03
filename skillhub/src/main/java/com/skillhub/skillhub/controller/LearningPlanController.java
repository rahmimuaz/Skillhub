package com.skillhub.skillhub.controller;

import com.skillhub.skillhub.model.LearningPlan;
import com.skillhub.skillhub.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @GetMapping("/user/{userId}")
    public List<LearningPlan> getUserPlans(@PathVariable String userId) {
        return learningPlanService.getUserLearningPlans(userId);
    }

    @GetMapping("/shared/{userId}")
    public List<LearningPlan> getSharedPlans(@PathVariable String userId) {
        return learningPlanService.getSharedLearningPlans(userId);
    }

    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan learningPlan) {
        return learningPlanService.createLearningPlan(learningPlan);
    }

    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable String id, @RequestBody LearningPlan learningPlan) {
        return learningPlanService.updateLearningPlan(id, learningPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable String id) {
        learningPlanService.deleteLearningPlan(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/share")
    public LearningPlan sharePlan(@PathVariable String id, @RequestBody List<String> userIds) {
        return learningPlanService.shareLearningPlan(id, userIds);
    }

    @GetMapping("/{id}")
    public LearningPlan getPlanById(@PathVariable String id) {
        return learningPlanService.getLearningPlanById(id);
    }
}