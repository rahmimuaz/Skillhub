package com.skillhub.skillhub.controller;

import com.skillhub.skillhub.model.LearningProgress;
import com.skillhub.skillhub.service.LearningProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learningProgress") 
@CrossOrigin(origins = "*")
public class LearningProgressController {

    @Autowired
    private LearningProgressService service;

    @GetMapping
    public List<LearningProgress> getAllProgress() {
        return service.getAllProgress();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningProgress> getProgressById(@PathVariable String id) {
        Optional<LearningProgress> progress = service.getProgressById(id);
        return progress.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<LearningProgress> getProgressByUserId(@PathVariable String userId) {
        return service.getProgressByUserId(userId);
    }

    @GetMapping("/plan/{planId}")
    public List<LearningProgress> getProgressByPlanId(@PathVariable String planId) {
        return service.getProgressByPlanId(planId);
    }

    @PostMapping
    public LearningProgress createProgress(@RequestBody LearningProgress progress) {
        return service.createProgress(progress);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningProgress> updateProgress(@PathVariable String id, @RequestBody LearningProgress updatedProgress) {
        LearningProgress progress = service.updateProgress(id, updatedProgress);
        return progress != null ? ResponseEntity.ok(progress) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        service.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }
}