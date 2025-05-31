package com.gomin.postoffice.service;

import com.gomin.postoffice.config.JwtConfig;
import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;

    @Autowired
    public VolunteerService(VolunteerRepository volunteerRepository, 
                          PasswordEncoder passwordEncoder,
                          JwtConfig jwtConfig) {
        this.volunteerRepository = volunteerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtConfig = jwtConfig;
    }

    // 봉사자 회원가입
    public Volunteer registerVolunteer(Volunteer volunteer) {
        // 비밀번호 해싱
        volunteer.setPassword(passwordEncoder.encode(volunteer.getPassword()));
        return volunteerRepository.save(volunteer);
    }

    // 이메일로 봉사자 찾기
    public Optional<Volunteer> findByEmail(String email) {
        return volunteerRepository.findByEmail(email);
    }

    // ID로 봉사자 찾기
    public Optional<Volunteer> findById(Long id) {
        return volunteerRepository.findById(id);
    }

    // 봉사자 로그인 (Spring Security에서 처리될 수 있음)
    // 여기서는 간단하게 비밀번호 확인만 예시
    public String authenticate(String email, String password) {
        Optional<Volunteer> optionalVolunteer = findByEmail(email);
        if (optionalVolunteer.isPresent()) {
            Volunteer volunteer = optionalVolunteer.get();
            if (passwordEncoder.matches(password, volunteer.getPassword())) {
                return jwtConfig.generateToken(email);
            }
        }
        return null;
    }
} 