package com.todoapp.controller;

import com.todoapp.dto.TaskDto;
import com.todoapp.model.Priority;
import com.todoapp.model.TaskStatus;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import com.todoapp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getMyTasks(
            Authentication authentication,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String search) {
        
        Long userId = getCurrentUserId(authentication);

        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(taskService.searchTasks(userId, search.trim()));
        }
        if (status != null) {
            return ResponseEntity.ok(taskService.getTasksByStatus(userId, status));
        }
        if (priority != null) {
            return ResponseEntity.ok(taskService.getTasksByPriority(userId, priority));
        }

        return ResponseEntity.ok(taskService.getTasksForUser(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksByUserId(@PathVariable Long userId, Authentication authentication) {
        return ResponseEntity.ok(taskService.getTasksForUser(userId));
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(taskService.createTask(userId, taskDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody TaskDto taskDto, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(taskService.updateTask(userId, id, taskDto));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskDto> toggleComplete(@PathVariable Long id, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(taskService.toggleTaskComplete(userId, id));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<TaskDto> archiveTask(@PathVariable Long id, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(taskService.archiveTask(userId, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        taskService.deleteTask(userId, id);
        return ResponseEntity.noContent().build();
    }
}
