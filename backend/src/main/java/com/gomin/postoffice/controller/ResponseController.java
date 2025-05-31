package com.gomin.postoffice.controller;

import com.gomin.postoffice.entity.Response;
import com.gomin.postoffice.service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
@CrossOrigin(origins = "*")
public class ResponseController {

    private final ResponseService responseService;

    @Autowired
    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    // 특정 고민에 답변 달기 (봉사자용 - Spring Security로 보호 예정)
    @PostMapping("/worry/{worryId}")
    // @PreAuthorize("hasRole('VOLUNTEER')") // 봉사자 권한 필요 예시
    public ResponseEntity<Response> createResponse(
            @PathVariable Long worryId,
            @RequestBody AddResponseRequest request
            // TODO: 봉사자 인증 정보 (@AuthenticationPrincipal 등)를 통해 volunteerId를 가져와야 함
    ) {
        // 임시 volunteerId 사용 (실제 구현 시 봉사자 인증 정보 사용)
        Long volunteerId = 1L; // 예시

        Response response = responseService.saveResponse(worryId, volunteerId, request.getContent());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 특정 고민에 달린 모든 답변 조회 (고민 접근 API에서 함께 제공되므로 별도 엔드포인트는 선택 사항)
    // @GetMapping("/worry/{worryId}")
    // public ResponseEntity<List<Response>> getResponsesByWorryId(@PathVariable Long worryId) {
    //     List<Response> responses = responseService.getResponsesByWorryId(worryId);
    //     return ResponseEntity.ok(responses);
    // }
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