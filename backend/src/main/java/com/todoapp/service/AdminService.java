package com.todoapp.service;

import com.todoapp.dto.UserDto;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userService::convertToDto)
                .toList();
    }

    @Transactional
    public void deleteUserAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
    }
}
