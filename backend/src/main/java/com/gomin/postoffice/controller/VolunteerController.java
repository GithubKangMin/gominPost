package com.gomin.postoffice.controller;

import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Volunteer volunteer) {
        try {
            Volunteer registeredVolunteer = volunteerService.register(volunteer);
            return ResponseEntity.ok(registeredVolunteer);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");

            if (username == null || password == null) {
                throw new RuntimeException("사용자명과 비밀번호를 모두 입력해주세요.");
            }

            Volunteer volunteer = volunteerService.login(username, password);
            return ResponseEntity.ok(volunteer);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 