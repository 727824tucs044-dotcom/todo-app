package com.todoapp.dto;

import com.todoapp.model.ReminderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReminderDto {
    private Long id;
    private Long taskId;
    private String taskTitle;
    private LocalDateTime reminderDate;
    private ReminderStatus status;
}
