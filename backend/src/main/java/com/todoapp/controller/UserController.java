package com.todoapp.controller;

import com.todoapp.dto.ChangePasswordRequest;
import com.todoapp.dto.UserDto;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import com.todoapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(userService.getUserProfile(user.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(@RequestBody UserDto dto, Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(userService.updateUserProfile(user.getId(), dto.getName(), dto.getEmail()));
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication authentication) {
        User user = getCurrentUser(authentication);
        userService.changePassword(user.getId(), request);
        return ResponseEntity.ok("Password updated successfully");
    }
}
