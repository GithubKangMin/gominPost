package com.gomin.postoffice.service;

import com.gomin.postoffice.config.JwtConfig;
import com.gomin.postoffice.entity.Worry;
import com.gomin.postoffice.repository.WorryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorryService {

    private final WorryRepository worryRepository;
    // PasswordEncoder와 JwtConfig는 현재 WorryService의 핵심 로직에 직접 사용되지 않으므로 제거하거나 필요에 따라 주입받도록 수정합니다.
    // private final PasswordEncoder passwordEncoder;
    // private final JwtConfig jwtConfig;

    @Autowired
    public WorryService(WorryRepository worryRepository) {
        this.worryRepository = worryRepository;
    }

    public Worry saveWorry(Worry worry) {
        // Note: Password hashing for Worry should be handled before saving, possibly in a dedicated service or controller.
        return worryRepository.save(worry);
    }

    public Optional<Worry> findById(Long id) {
        return worryRepository.findById(id);
    }

    public List<Worry> getAllWorries() {
        return worryRepository.findAll();
    }

    public Optional<Worry> checkWorry(String nickname, String password) {
        Optional<Worry> optionalWorry = worryRepository.findByNickname(nickname);
        if (optionalWorry.isPresent()) {
            Worry worry = optionalWorry.get();
            // Note: Simple password check for MVP. In production, use secure password hashing.
            if (worry.getPassword().equals(password)) {
                return Optional.of(worry);
            }
        }
        return Optional.empty();
    }

    // 봉사자 대시보드용 고민 목록 조회 (예시: 모든 고민 반환)
    public List<Worry> getWorriesForVolunteer() {
        // TODO: 실제 구현에서는 봉사자와 매칭되지 않았거나 답변이 필요한 고민만 반환하도록 필터링 필요
        return worryRepository.findAll();
    }
} 