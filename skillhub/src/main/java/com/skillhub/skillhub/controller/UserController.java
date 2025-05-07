package com.skillhub.skillhub.controller;

import com.skillhub.skillhub.model.User;
import com.skillhub.skillhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll().stream()
            .map(user -> {
                // Remove sensitive information
                user.setPassword(null);
                return user;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}
