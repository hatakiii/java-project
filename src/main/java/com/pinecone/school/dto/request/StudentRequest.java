package com.pinecone.school.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {

    @NotBlank(message = "Нэр хоосон байж болохгүй")
    private String firstName;

    @NotBlank(message = "Овог хоосон байж болохгүй")
    private String lastName;

    @Min(value = 6, message = "Нас 6-аас дээш байна")
    private Integer age;

    @NotBlank(message = "Анги хоосон байж болохгүй")
    private String grade;

    private String phoneNumber;

    private String address;

    private String imageUrl;
}
