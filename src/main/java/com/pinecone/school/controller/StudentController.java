package com.pinecone.school.controller;

import com.pinecone.school.dto.request.StudentRequest;
import com.pinecone.school.dto.response.ApiResponse;
import com.pinecone.school.model.Student;
import com.pinecone.school.repository.TeacherRepository;
import com.pinecone.school.service.CloudinaryService;
import com.pinecone.school.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final TeacherRepository teacherRepository;
    private final CloudinaryService cloudinaryService;

    // Нэвтэрсэн багшийн teacherId авах helper
    private String getTeacherId(UserDetails userDetails) {
        return teacherRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Багш олдсонгүй"))
                .getId();
    }

    // GET /api/students - Бүх сурагч авах
    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        String teacherId = getTeacherId(userDetails);
        List<Student> students = studentService.getStudentsByTeacher(teacherId);
        return ResponseEntity.ok(ApiResponse.success("Сурагчдын жагсаалт", students));
    }

    // GET /api/students/{id} - Нэг сурагч авах
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getById(@PathVariable String id,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String teacherId = getTeacherId(userDetails);
            Student student = studentService.getStudentById(id, teacherId);
            return ResponseEntity.ok(ApiResponse.success("Сурагчийн мэдээлэл", student));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /api/students - Сурагч нэмэх
    @PostMapping
    public ResponseEntity<ApiResponse<Student>> create(@Valid @RequestBody StudentRequest request,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String teacherId = getTeacherId(userDetails);
            Student student = studentService.createStudent(request, teacherId);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Сурагч амжилттай нэмэгдлээ!", student));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // PUT /api/students/{id} - Сурагч засах
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> update(@PathVariable String id,
                                                        @Valid @RequestBody StudentRequest request,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String teacherId = getTeacherId(userDetails);
            Student student = studentService.updateStudent(id, request, teacherId);
            return ResponseEntity.ok(ApiResponse.success("Сурагчийн мэдээлэл амжилттай шинэчлэгдлээ!", student));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // DELETE /api/students/{id} - Сурагч устгах
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String teacherId = getTeacherId(userDetails);
            studentService.deleteStudent(id, teacherId);
            return ResponseEntity.ok(ApiResponse.success("Сурагч амжилттай устгагдлаа!", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /api/students/upload-image - Зураг Cloudinary-д байршуулах
    @PostMapping("/upload-image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            getTeacherId(userDetails); // Эрх шалгах
            String imageUrl = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(ApiResponse.success("Зураг амжилттай байршуулагдлаа!",
                    Map.of("imageUrl", imageUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Зураг байршуулахад алдаа: " + e.getMessage()));
        }
    }
}

