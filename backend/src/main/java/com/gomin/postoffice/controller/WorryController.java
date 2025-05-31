package com.gomin.postoffice.controller;

import com.gomin.postoffice.entity.Worry;
import com.gomin.postoffice.entity.Response;
import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.service.WorryService;
import com.gomin.postoffice.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/worries")
@CrossOrigin(origins = "http://localhost:3000")
public class WorryController {

    @Autowired
    private WorryService worryService;

    @Autowired
    private VolunteerService volunteerService;

    @PostMapping
    public ResponseEntity<?> createWorry(@RequestBody Worry worry) {
        try {
            Worry createdWorry = worryService.createWorry(worry);
            return ResponseEntity.ok(createdWorry);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<List<Worry>> getAllWorries(
            @RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(worryService.getWorriesByStatus(status));
        }
        return ResponseEntity.ok(worryService.getAllWorries());
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkWorries(
            @RequestParam String nickname,
            @RequestParam String password) {
        try {
            List<Worry> worries = worryService.getWorriesByNicknameAndPassword(nickname, password);
            return ResponseEntity.ok(worries);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{worryId}/responses")
    public ResponseEntity<?> addResponse(
            @PathVariable Long worryId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        try {
            // Basic 인증 헤더에서 사용자 정보 추출
            String[] credentials = new String(java.util.Base64.getDecoder()
                    .decode(authHeader.replace("Basic ", ""))).split(":");
            String username = credentials[0];
            String password = credentials[1];

            // 봉사자 인증
            Volunteer volunteer = volunteerService.login(username, password);
            
            // 답변 추가
            Response response = worryService.addResponse(
                worryId,
                volunteer,
                request.get("content")
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{worryId}/responses")
    public ResponseEntity<List<Response>> getResponses(@PathVariable Long worryId) {
        return ResponseEntity.ok(worryService.getResponsesByWorryId(worryId));
    }
} 