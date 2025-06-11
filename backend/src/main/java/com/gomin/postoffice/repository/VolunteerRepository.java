package com.gomin.postoffice.repository;

import com.gomin.postoffice.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    // 이메일로 봉사자를 찾는 메서드
    Optional<Volunteer> findByEmail(String email);

    Optional<Volunteer> findByUsername(String username);
} 