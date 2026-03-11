package com.pinecone.school.service;

import com.pinecone.school.dto.request.StudentRequest;
import com.pinecone.school.model.Student;
import com.pinecone.school.repository.StudentRepository;
import com.pinecone.school.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    // Багшийн бүх сурагчдыг авах
    public List<Student> getStudentsByTeacher(String teacherId) {
        return studentRepository.findByTeacherId(teacherId);
    }

    // Сурагч үүсгэх
    public Student createStudent(StudentRequest request, String teacherId) {
        Student student = Student.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .age(request.getAge())
                .grade(request.getGrade())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .teacherId(teacherId)
                .build();
        return studentRepository.save(student);
    }

    // Сурагч шинэчлэх
    public Student updateStudent(String id, StudentRequest request, String teacherId) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Сурагч олдсонгүй"));

        if (!existing.getTeacherId().equals(teacherId)) {
            throw new RuntimeException("Та энэ сурагчийг засах эрхгүй байна");
        }

        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setAge(request.getAge());
        existing.setGrade(request.getGrade());
        existing.setPhoneNumber(request.getPhoneNumber());
        existing.setAddress(request.getAddress());

        return studentRepository.save(existing);
    }

    // Сурагч устгах
    public void deleteStudent(String id, String teacherId) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Сурагч олдсонгүй"));

        if (!existing.getTeacherId().equals(teacherId)) {
            throw new RuntimeException("Та энэ сурагчийг устгах эрхгүй байна");
        }

        studentRepository.deleteById(id);
    }

    // Нэг сурагч авах
    public Student getStudentById(String id, String teacherId) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Сурагч олдсонгүй"));

        if (!student.getTeacherId().equals(teacherId)) {
            throw new RuntimeException("Та энэ сурагчийг харах эрхгүй байна");
        }

        return student;
    }

    private String resolveTeacherId(String username) {
        return teacherRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Багш олдсонгүй"))
                .getId();
    }
}
