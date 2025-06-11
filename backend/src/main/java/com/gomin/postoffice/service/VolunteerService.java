package com.gomin.postoffice.service;

import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Volunteer register(Volunteer volunteer) {
        // 이메일 중복 체크
        if (volunteerRepository.findByEmail(volunteer.getEmail()).isPresent()) {
            throw new RuntimeException("이미 등록된 이메일입니다.");
        }

        // 사용자명 중복 체크
        if (volunteerRepository.findByUsername(volunteer.getUsername()).isPresent()) {
            throw new RuntimeException("이미 사용 중인 사용자명입니다.");
        }

        // 비밀번호 암호화
        volunteer.setPassword(passwordEncoder.encode(volunteer.getPassword()));
        
        return volunteerRepository.save(volunteer);
    }

    public Volunteer login(String username, String password) {
        Optional<Volunteer> volunteerOpt = volunteerRepository.findByUsername(username);
        
        if (volunteerOpt.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        Volunteer volunteer = volunteerOpt.get();
        
        if (!passwordEncoder.matches(password, volunteer.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return volunteer;
    }

    public Optional<Volunteer> findById(Long id) {
        return volunteerRepository.findById(id);
    }
} 