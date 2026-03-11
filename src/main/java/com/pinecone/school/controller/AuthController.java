package com.pinecone.school.controller;

import com.pinecone.school.dto.request.LoginRequest;
import com.pinecone.school.dto.request.RegisterRequest;
import com.pinecone.school.dto.response.ApiResponse;
import com.pinecone.school.dto.response.AuthResponse;
import com.pinecone.school.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TeacherService teacherService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = teacherService.register(request);
            return ResponseEntity.ok(ApiResponse.success("Бүртгэл амжилттай үүслээ!", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = teacherService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Нэвтрэлт амжилттай!", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна"));
        }
    }

   
}
