package com.todoapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "deadline_date")
    private LocalDateTime deadlineDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Column(name = "is_archived", nullable = false)
    private boolean isArchived;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecurringPattern recurring;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (priority == null) {
            priority = Priority.MEDIUM;
        }
        if (status == null) {
            status = TaskStatus.INCOMPLETE;
        }
        if (recurring == null) {
            recurring = RecurringPattern.NONE;
        }
    }
}
