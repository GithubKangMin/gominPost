package com.gomin.postoffice.repository;

import com.gomin.postoffice.entity.Worry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorryRepository extends JpaRepository<Worry, Long> {
    // 닉네임과 비밀번호로 고민을 찾는 메서드
    List<Worry> findByNicknameAndPassword(String nickname, String password);

    // 닉네임으로 고민을 찾는 메서드
    Optional<Worry> findByNickname(String nickname);

    List<Worry> findByResponsesIsEmpty();
    List<Worry> findByResponsesIsNotEmpty();
} 