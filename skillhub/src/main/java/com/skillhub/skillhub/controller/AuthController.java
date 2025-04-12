package com.skillhub.skillhub.controller;

import com.skillhub.skillhub.model.User;
import com.skillhub.skillhub.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth") 
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Password Hasher
    }

    // ✅ REGISTER API
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash password
        user.setProvider("manual"); // Mark user as manually registered
        userRepository.save(user);
        return "User registered successfully!";
    }

    // ✅ LOGIN API
    @PostMapping("/login")
    public String loginUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            User dbUser = existingUser.get();
            if (passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                return "Login successful!";
            } else {
                return "Invalid password!";
            }
        }
        return "User not found!";
    }
}
