package com.gomin.postoffice.controller;

import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "*") // 개발 단계에서 모든 출처 허용
public class VolunteerController {

    private final VolunteerService volunteerService;

    @Autowired
    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    // 봉사자 회원가입 엔드포인트
    @PostMapping("/register")
    public ResponseEntity<Volunteer> registerVolunteer(@RequestBody Volunteer volunteer) {
        Volunteer registeredVolunteer = volunteerService.registerVolunteer(volunteer);
        return new ResponseEntity<>(registeredVolunteer, HttpStatus.CREATED);
    }

    // 봉사자 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<?> loginVolunteer(@RequestBody LoginRequest request) {
        String token = volunteerService.authenticate(request.getEmail(), request.getPassword());
        if (token != null) {
            // 로그인 성공 시 토큰과 봉사자 정보 반환
            // 실제 구현에서는 민감한 정보 제외하고 필요한 정보만 반환하도록 DTO 사용 권장
            Volunteer volunteer = volunteerService.findByEmail(request.getEmail()).get(); // 인증 성공했으므로 Optional.get() 사용
            return ResponseEntity.ok().body(new LoginResponse(token, volunteer));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}

// 로그인 요청 DTO (필요에 따라 별도 파일로 분리 가능)
class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

// 로그인 응답 DTO (필요에 따라 별도 파일로 분리 가능)
class LoginResponse {
    private String token;
    private Volunteer volunteer;

    public LoginResponse(String token, Volunteer volunteer) {
        this.token = token;
        this.volunteer = volunteer;
    }

    public String getToken() {
        return token;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }
} 