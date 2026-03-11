package com.pinecone.school.repository;

import com.pinecone.school.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    List<Student> findByTeacherId(String teacherId);
    void deleteByIdAndTeacherId(String id, String teacherId);
}
