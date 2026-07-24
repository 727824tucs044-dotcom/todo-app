package com.todoapp.service;

import com.todoapp.dto.ReminderDto;
import com.todoapp.model.Reminder;
import com.todoapp.model.ReminderStatus;
import com.todoapp.model.Task;
import com.todoapp.repository.ReminderRepository;
import com.todoapp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<ReminderDto> getRemindersForUser(Long userId) {
        return reminderRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .toList();
    }

    @Transactional
    public ReminderDto createReminder(Long userId, Long taskId, LocalDateTime reminderDate) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to task");
        }

        Reminder reminder = Reminder.builder()
                .task(task)
                .reminderDate(reminderDate)
                .status(ReminderStatus.PENDING)
                .build();

        return convertToDto(reminderRepository.save(reminder));
    }

    @Transactional
    public ReminderDto markAsSent(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        reminder.setStatus(ReminderStatus.SENT);
        return convertToDto(reminderRepository.save(reminder));
    }

    private ReminderDto convertToDto(Reminder reminder) {
        return ReminderDto.builder()
                .id(reminder.getId())
                .taskId(reminder.getTask().getId())
                .taskTitle(reminder.getTask().getTitle())
                .reminderDate(reminder.getReminderDate())
                .status(reminder.getStatus())
                .build();
    }
}
