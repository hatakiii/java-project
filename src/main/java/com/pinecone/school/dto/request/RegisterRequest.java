package com.pinecone.school.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Хэрэглэгчийн нэр хоосон байж болохгүй")
    @Size(min = 3, max = 30, message = "Хэрэглэгчийн нэр 3-30 тэмдэгт байна")
    private String username;

    @NotBlank(message = "И-мэйл хоосон байж болохгүй")
    @Email(message = "И-мэйлийн формат буруу байна")
    private String email;

    @NotBlank(message = "Нууц үг хоосон байж болохгүй")
    @Size(min = 6, message = "Нууц үг хамгийн багадаа 6 тэмдэгт байна")
    private String password;
}
