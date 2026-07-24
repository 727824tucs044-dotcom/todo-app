package com.todoapp.service;

import com.todoapp.dto.TaskDto;
import com.todoapp.model.*;
import com.todoapp.repository.ReminderRepository;
import com.todoapp.repository.TaskRepository;
import com.todoapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    public List<TaskDto> getTasksForUser(Long userId) {
        return taskRepository.findByUserIdAndIsArchivedFalseOrderByDeadlineDateAsc(userId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<TaskDto> getTasksByStatus(Long userId, TaskStatus status) {
        return taskRepository.findByUserIdAndStatusAndIsArchivedFalse(userId, status)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<TaskDto> getTasksByPriority(Long userId, Priority priority) {
        return taskRepository.findByUserIdAndPriorityAndIsArchivedFalse(userId, priority)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<TaskDto> searchTasks(Long userId, String query) {
        return taskRepository.searchTasksByUser(userId, query)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<TaskDto> getTasksByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return taskRepository.findTasksByDateRange(userId, startDate, endDate)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    @Transactional
    public TaskDto createTask(Long userId, TaskDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Task task = Task.builder()
                .user(user)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .deadlineDate(dto.getDeadlineDate())
                .priority(dto.getPriority() != null ? dto.getPriority() : Priority.MEDIUM)
                .status(dto.getStatus() != null ? dto.getStatus() : TaskStatus.INCOMPLETE)
                .isArchived(false)
                .recurring(dto.getRecurring() != null ? dto.getRecurring() : RecurringPattern.NONE)
                .build();

        Task savedTask = taskRepository.save(task);

        if (dto.getReminderDate() != null) {
            Reminder reminder = Reminder.builder()
                    .task(savedTask)
                    .reminderDate(dto.getReminderDate())
                    .status(ReminderStatus.PENDING)
                    .build();
            reminderRepository.save(reminder);
        }

        return convertToDto(savedTask);
    }

    @Transactional
    public TaskDto updateTask(Long userId, Long taskId, TaskDto dto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        if (!task.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to task");
        }

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDeadlineDate(dto.getDeadlineDate());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getRecurring() != null) task.setRecurring(dto.getRecurring());

        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    @Transactional
    public TaskDto toggleTaskComplete(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to task");
        }

        task.setStatus(task.getStatus() == TaskStatus.COMPLETE ? TaskStatus.INCOMPLETE : TaskStatus.COMPLETE);
        return convertToDto(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to task");
        }

        taskRepository.delete(task);
    }

    @Transactional
    public TaskDto archiveTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to task");
        }

        task.setArchived(true);
        return convertToDto(taskRepository.save(task));
    }

    public TaskDto convertToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .userId(task.getUser().getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .deadlineDate(task.getDeadlineDate())
                .priority(task.getPriority())
                .status(task.getStatus())
                .isArchived(task.isArchived())
                .recurring(task.getRecurring())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
