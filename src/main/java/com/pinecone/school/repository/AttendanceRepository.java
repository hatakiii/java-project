package com.pinecone.school.repository;

import com.pinecone.school.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByTeacherIdAndDate(String teacherId, LocalDate date);

    Optional<Attendance> findByStudentIdAndDate(String studentId, LocalDate date);

    List<Attendance> findByStudentId(String studentId);
}
