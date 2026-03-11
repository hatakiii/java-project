package com.pinecone.school.controller;

import com.pinecone.school.dto.request.AttendanceRequest;
import com.pinecone.school.dto.response.ApiResponse;
import com.pinecone.school.dto.response.AttendanceResponse;
import com.pinecone.school.repository.TeacherRepository;
import com.pinecone.school.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final TeacherRepository teacherRepository;

    private String getTeacherId(UserDetails userDetails) {
        return teacherRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Багш олдсонгүй"))
                .getId();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> markAttendance(@Valid @RequestBody AttendanceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String teacherId = getTeacherId(userDetails);
            attendanceService.markAttendance(request, teacherId);
            return ResponseEntity.ok(ApiResponse.success("Ирц амжилттай бүртгэгдлээ", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (date == null) {
            date = LocalDate.now();
        }

        try {
            String teacherId = getTeacherId(userDetails);
            List<AttendanceResponse> response = attendanceService.getAttendanceForDate(date, teacherId);
            return ResponseEntity.ok(ApiResponse.success("Ирцийн бүртгэл", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
