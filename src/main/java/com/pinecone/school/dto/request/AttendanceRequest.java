package com.pinecone.school.dto.request;

import com.pinecone.school.model.Attendance.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class AttendanceRequest {

    @NotNull(message = "Огноо оруулна уу")
    private LocalDate date;

    @NotNull(message = "Сурагчдын ирц оруулна уу")
    private Map<String, AttendanceStatus> studentStatuses; // studentId -> status
}
