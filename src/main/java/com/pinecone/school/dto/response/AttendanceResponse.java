package com.pinecone.school.dto.response;

import com.pinecone.school.model.Attendance.AttendanceStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceResponse {
    private String studentId;
    private String fullName;
    private AttendanceStatus status;
}
