package com.skillhub.skillhub.service;

import com.skillhub.skillhub.model.LearningProgress;
import com.skillhub.skillhub.repository.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LearningProgressService {

    @Autowired
    private LearningProgressRepository repository;

    public List<LearningProgress> getAllProgress() {
        return repository.findAll();
    }

    public Optional<LearningProgress> getProgressById(String id) {
        return repository.findById(id);
    }

    public List<LearningProgress> getProgressByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public List<LearningProgress> getProgressByPlanId(String planId) {
        return repository.findByPlanId(planId);
    }

    public LearningProgress createProgress(LearningProgress progress) {
        return repository.save(progress);
    }

    public LearningProgress updateProgress(String id, LearningProgress updatedProgress) {
        if (repository.existsById(id)) {
            updatedProgress.setId(id);
            return repository.save(updatedProgress);
        }
        return null;
    }

    public void deleteProgress(String id) {
        repository.deleteById(id);
    }
}