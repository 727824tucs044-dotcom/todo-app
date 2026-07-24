package com.todoapp.dto;

import com.todoapp.model.Priority;
import com.todoapp.model.RecurringPattern;
import com.todoapp.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private LocalDateTime deadlineDate;
    private Priority priority;
    private TaskStatus status;
    private boolean isArchived;
    private RecurringPattern recurring;
    private LocalDateTime createdAt;
    private LocalDateTime reminderDate;
}
