package com.pinecone.school.repository;

import com.pinecone.school.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    List<Student> findByTeacherIdAndDeletedFalse(String teacherId);
    List<Student> findByTeacherIdAndDeletedTrue(String teacherId);
    List<Student> findAllByDeletedTrueAndDeletedAtBefore(java.time.LocalDateTime dateTime);
    void deleteByIdAndTeacherId(String id, String teacherId);
}
