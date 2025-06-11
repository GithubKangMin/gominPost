package com.gomin.postoffice.config;

import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final VolunteerRepository volunteerRepository;

    @Autowired
    public CustomUserDetailsService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Volunteer volunteer = volunteerRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new User(
                volunteer.getUsername(),
                volunteer.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_VOLUNTEER"))
        );
    }
} 