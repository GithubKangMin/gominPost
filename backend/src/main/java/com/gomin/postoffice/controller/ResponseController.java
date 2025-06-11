package com.gomin.postoffice.controller;

import com.gomin.postoffice.entity.Response;
import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.service.ResponseService;
import com.gomin.postoffice.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Request DTO for adding a response
class AddResponseRequest {
    private String content;
    private Long volunteerId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }
}

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "http://localhost:3000")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @Autowired
    private VolunteerService volunteerService;

    @PostMapping
    public ResponseEntity<?> createResponse(@RequestBody Map<String, Object> payload) {
        try {
            Long worryId = Long.parseLong(payload.get("worryId").toString());
            Long volunteerId = Long.parseLong(payload.get("volunteerId").toString());
            String content = (String) payload.get("content");

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("응답 내용을 입력해주세요.");
            }

            Volunteer volunteer = volunteerService.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("봉사자를 찾을 수 없습니다."));

            Response response = responseService.createResponse(worryId, volunteer, content);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/worry/{worryId}")
    public ResponseEntity<?> getResponsesByWorryId(@PathVariable Long worryId) {
        try {
            List<Response> responses = responseService.getResponsesByWorryId(worryId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<?> getResponsesByVolunteerId(@PathVariable Long volunteerId) {
        try {
            List<Response> responses = responseService.getResponsesByVolunteerId(volunteerId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

// 답변 요청 DTO (필요에 따라 별도 파일로 분리 가능)
class ResponseRequest {
    private Long volunteerId;
    private String content;

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
} 