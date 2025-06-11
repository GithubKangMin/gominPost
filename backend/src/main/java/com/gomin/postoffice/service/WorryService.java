package com.gomin.postoffice.service;

import com.gomin.postoffice.entity.Worry;
import com.gomin.postoffice.entity.Response;
import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.repository.WorryRepository;
import com.gomin.postoffice.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorryService {

    @Autowired
    private WorryRepository worryRepository;

    @Autowired
    private ResponseRepository responseRepository;

    public Worry createWorry(Worry worry) {
        return worryRepository.save(worry);
    }

    public List<Worry> getAllWorries() {
        return worryRepository.findAll();
    }

    public Optional<Worry> getWorryById(Long id) {
        return worryRepository.findById(id);
    }

    public List<Worry> getWorriesByNicknameAndPassword(String nickname, String password) {
        return worryRepository.findByNicknameAndPassword(nickname, password);
    }

    public Response addResponse(Long worryId, Volunteer volunteer, String content) {
        Optional<Worry> worryOpt = worryRepository.findById(worryId);
        if (worryOpt.isEmpty()) {
            throw new RuntimeException("고민을 찾을 수 없습니다.");
        }

        Worry worry = worryOpt.get();
        Response response = new Response(worry, volunteer, content);
        return responseRepository.save(response);
    }

    public List<Response> getResponsesByWorryId(Long worryId) {
        return responseRepository.findByWorryId(worryId);
    }

    public List<Worry> getWorriesByStatus(String status) {
        switch (status) {
            case "ongoing":
                return worryRepository.findByResponsesIsEmpty();
            case "completed":
                return worryRepository.findByResponsesIsNotEmpty();
            default:
                return worryRepository.findAll();
        }
    }

    public Worry updateWorryStatus(Long id, String status) {
        Optional<Worry> worryOpt = worryRepository.findById(id);
        if (worryOpt.isEmpty()) {
            throw new RuntimeException("고민을 찾을 수 없습니다.");
        }
        Worry worry = worryOpt.get();
        worry.setStatus(status);
        return worryRepository.save(worry);
    }
} 