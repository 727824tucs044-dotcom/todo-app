package com.todoapp.config;

import com.todoapp.model.*;
import com.todoapp.repository.ReminderRepository;
import com.todoapp.repository.TaskRepository;
import com.todoapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@todo.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);

            // Seed Regular User
            User regularUser = User.builder()
                    .name("Alex Morgan")
                    .email("user@todo.com")
                    .passwordHash(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .build();
            User savedUser = userRepository.save(regularUser);

            // Seed Demo Tasks
            Task task1 = Task.builder()
                    .user(savedUser)
                    .title("Complete SRS Document Review")
                    .description("Review functional requirements and submit client architectural specs.")
                    .deadlineDate(LocalDateTime.now().plusDays(1))
                    .priority(Priority.HIGH)
                    .status(TaskStatus.INCOMPLETE)
                    .isArchived(false)
                    .recurring(RecurringPattern.NONE)
                    .build();
            Task savedTask1 = taskRepository.save(task1);

            Task task2 = Task.builder()
                    .user(savedUser)
                    .title("Design Interactive Calendar UI")
                    .description("Implement modern React visual monthly calendar with date selection.")
                    .deadlineDate(LocalDateTime.now().plusDays(3))
                    .priority(Priority.MEDIUM)
                    .status(TaskStatus.INCOMPLETE)
                    .isArchived(false)
                    .recurring(RecurringPattern.WEEKLY)
                    .build();
            taskRepository.save(task2);

            Task task3 = Task.builder()
                    .user(savedUser)
                    .title("Configure Spring Security JWT Auth")
                    .description("Stateless session management and CORS setup.")
                    .deadlineDate(LocalDateTime.now().minusDays(1))
                    .priority(Priority.HIGH)
                    .status(TaskStatus.COMPLETE)
                    .isArchived(false)
                    .recurring(RecurringPattern.NONE)
                    .build();
            taskRepository.save(task3);

            // Seed Reminder
            Reminder reminder1 = Reminder.builder()
                    .task(savedTask1)
                    .reminderDate(LocalDateTime.now().plusHours(4))
                    .status(ReminderStatus.PENDING)
                    .build();
            reminderRepository.save(reminder1);
        }
    }
}
