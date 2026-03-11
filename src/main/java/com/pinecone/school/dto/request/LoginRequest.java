package com.pinecone.school.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Хэрэглэгчийн нэр хоосон байж болохгүй")
    private String username;

    @NotBlank(message = "Нууц үг хоосон байж болохгүй")
    private String password;
}
