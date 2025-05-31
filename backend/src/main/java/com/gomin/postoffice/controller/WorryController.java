package com.gomin.postoffice.controller;

import com.gomin.postoffice.entity.Worry;
import com.gomin.postoffice.service.WorryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Request DTO for worry creation (optional, for better practice)
// class CreateWorryRequest {
//     private String nickname;
//     private String password;
//     private String category;
//     private String content;
//     // getters and setters
// }

// Request DTO for worry access
class AccessWorryRequest {
    private String nickname;
    private String password;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

@RestController
@RequestMapping("/api/worries")
@CrossOrigin(origins = "*") // 개발 단계에서 모든 출처 허용
public class WorryController {

    private final WorryService worryService;

    @Autowired
    public WorryController(WorryService worryService) {
        this.worryService = worryService;
    }

    // 고민 작성 엔드포인트
    @PostMapping
    public ResponseEntity<Worry> createWorry(@RequestBody Worry worry) {
        Worry savedWorry = worryService.saveWorry(worry);
        return new ResponseEntity<>(savedWorry, HttpStatus.CREATED);
    }

    // 모든 고민 조회 엔드포인트 (봉사자 대시보드용)
    @GetMapping
    public ResponseEntity<List<Worry>> getAllWorriesForVolunteer() {
        List<Worry> worries = worryService.getWorriesForVolunteer();
        return new ResponseEntity<>(worries, HttpStatus.OK);
    }

    // 특정 고민 상세 조회 엔드포인트 (사용되지 않을 수 있음)
    @GetMapping("/{id}")
    public ResponseEntity<Worry> getWorryById(@PathVariable Long id) {
        Optional<Worry> worry = worryService.findById(id);
        return worry.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 고민 확인 엔드포인트 (닉네임과 비밀번호로 조회)
    @PostMapping("/check")
    public ResponseEntity<?> checkWorry(@RequestBody WorryCheckRequest request) {
        Optional<Worry> worry = worryService.checkWorry(request.getNickname(), request.getPassword());
        if (worry.isPresent()) {
            return new ResponseEntity<>(worry.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid nickname or password", HttpStatus.UNAUTHORIZED);
        }
    }
}

// 고민 확인 요청 DTO (필요에 따라 별도 파일로 분리 가능)
class WorryCheckRequest {
    private String nickname;
    private String password;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

// TODO: 봉사자 답변 추가 엔드포인트 구현 필요 