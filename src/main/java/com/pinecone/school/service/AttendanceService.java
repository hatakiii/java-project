package com.pinecone.school.service;

import com.pinecone.school.dto.request.AttendanceRequest;
import com.pinecone.school.dto.response.AttendanceResponse;
import com.pinecone.school.model.Attendance;
import com.pinecone.school.model.Student;
import com.pinecone.school.repository.AttendanceRepository;
import com.pinecone.school.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public void markAttendance(AttendanceRequest request, String teacherId) {
        LocalDate date = request.getDate();
        Map<String, Attendance.AttendanceStatus> statuses = request.getStudentStatuses();

        for (Map.Entry<String, Attendance.AttendanceStatus> entry : statuses.entrySet()) {
            String studentId = entry.getKey();
            Attendance.AttendanceStatus status = entry.getValue();

            // Check if record exists for this student on this date
            Optional<Attendance> existing = attendanceRepository.findByStudentIdAndDate(studentId, date);

            Attendance attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
                attendance.setStatus(status);
            } else {
                attendance = Attendance.builder()
                        .studentId(studentId)
                        .teacherId(teacherId)
                        .date(date)
                        .status(status)
                        .build();
            }
            attendanceRepository.save(attendance);
        }
    }

    public List<AttendanceResponse> getAttendanceForDate(LocalDate date, String teacherId) {
        List<Student> students = studentRepository.findByTeacherId(teacherId);
        List<Attendance> attendances = attendanceRepository.findByTeacherIdAndDate(teacherId, date);

        Map<String, Attendance.AttendanceStatus> attendanceMap = attendances.stream()
                .collect(Collectors.toMap(Attendance::getStudentId, Attendance::getStatus));

        List<AttendanceResponse> responses = new ArrayList<>();
        for (Student student : students) {
            responses.add(AttendanceResponse.builder()
                    .studentId(student.getId())
                    .fullName(student.getLastName() + " " + student.getFirstName())
                    .status(attendanceMap.getOrDefault(student.getId(), null))
                    .build());
        }
        return responses;
    }
}
