package com.todoapp.repository;

import com.todoapp.model.Reminder;
import com.todoapp.model.ReminderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    @Query("SELECT r FROM Reminder r WHERE r.task.user.id = :userId ORDER BY r.reminderDate ASC")
    List<Reminder> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Reminder r WHERE r.task.user.id = :userId AND r.status = :status ORDER BY r.reminderDate ASC")
    List<Reminder> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ReminderStatus status);
}
