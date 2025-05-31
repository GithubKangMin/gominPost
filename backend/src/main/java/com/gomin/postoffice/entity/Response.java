package com.gomin.postoffice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "responses")
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "worry_id", nullable = false)
    private Worry worry;

    @ManyToOne
    @JoinColumn(name = "volunteer_id", nullable = false)
    private Volunteer volunteer;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public void setWorry(Worry worry) {
        this.worry = worry;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Default constructor required by JPA
    public Response() {}

    // Constructor for creating a new Response
    public Response(Worry worry, Volunteer volunteer, String content) {
        this.worry = worry;
        this.volunteer = volunteer;
        this.content = content;
    }

    // Helper method to get volunteer name (for simplicity, assuming Volunteer has a name or email field)
    public String getVolunteerName() {
        return volunteer != null ? volunteer.getEmail() : "Unknown Volunteer"; // Assuming email as name
    }
} 