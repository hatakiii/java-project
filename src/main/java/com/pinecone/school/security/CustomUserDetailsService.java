package com.pinecone.school.security;

import com.pinecone.school.model.Teacher;
import com.pinecone.school.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final TeacherRepository teacherRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Teacher teacher = teacherRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Багш олдсонгүй: " + username));

        return User.builder()
                .username(teacher.getUsername())
                .password(teacher.getPassword())
                .roles("TEACHER")
                .build();
    }
}
