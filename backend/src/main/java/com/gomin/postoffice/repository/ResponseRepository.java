package com.gomin.postoffice.repository;

import com.gomin.postoffice.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    // 특정 고민 ID로 답변 목록 조회
    List<Response> findByWorryId(Long worryId);

    // 특정 봉사자 ID로 답변 목록 조회
    List<Response> findByVolunteerId(Long volunteerId);
} 