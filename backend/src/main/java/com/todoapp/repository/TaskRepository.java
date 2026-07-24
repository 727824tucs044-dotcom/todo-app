package com.todoapp.repository;

import com.todoapp.model.Priority;
import com.todoapp.model.Task;
import com.todoapp.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdAndIsArchivedFalseOrderByDeadlineDateAsc(Long userId);
    List<Task> findByUserIdAndStatusAndIsArchivedFalse(Long userId, TaskStatus status);
    List<Task> findByUserIdAndPriorityAndIsArchivedFalse(Long userId, Priority priority);
    
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.isArchived = false AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Task> searchTasksByUser(@Param("userId") Long userId, @Param("query") String query);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.isArchived = false AND " +
           "t.deadlineDate BETWEEN :startDate AND :endDate ORDER BY t.deadlineDate ASC")
    List<Task> findTasksByDateRange(@Param("userId") Long userId, 
                                    @Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);

    List<Task> findByUserId(Long userId);
}
