package com.pinecone.school.service;

import com.pinecone.school.dto.request.LoginRequest;
import com.pinecone.school.dto.request.RegisterRequest;
import com.pinecone.school.dto.response.AuthResponse;
import com.pinecone.school.model.Teacher;
import com.pinecone.school.repository.TeacherRepository;
import com.pinecone.school.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (teacherRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Энэ хэрэглэгчийн нэр бүртгэлтэй байна");
        }
        if (teacherRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Энэ и-мэйл бүртгэлтэй байна");
        }

        Teacher teacher = Teacher.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        Teacher saved = teacherRepository.save(teacher);
        String token = jwtUtil.generateToken(saved.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(saved.getUsername())
                .email(saved.getEmail())
                .id(saved.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Teacher teacher = teacherRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Багш олдсонгүй"));

        String token = jwtUtil.generateToken(teacher.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(teacher.getUsername())
                .email(teacher.getEmail())
                .id(teacher.getId())
                .build();
    }
}
