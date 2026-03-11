package com.pinecone.school.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    private Integer age;

    private String grade;       // Анги, жишээ: "10A"

    private String phoneNumber;

    private String address;

    private String teacherId;   // Ямар багшийн сурагч болохыг тодорхойлно
}
