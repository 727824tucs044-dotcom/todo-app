package com.todoapp.controller;

import com.todoapp.dto.TaskDto;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import com.todoapp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDto>> getTasksForDateRange(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(taskService.getTasksByDateRange(user.getId(), startDate, endDate));
    }
}
