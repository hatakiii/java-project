package com.pinecone.school.repository;

import com.pinecone.school.model.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends MongoRepository<Teacher, String> {
    Optional<Teacher> findByUsername(String username);
    Optional<Teacher> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
