package com.gomin.postoffice.service;

import com.gomin.postoffice.entity.Response;
import com.gomin.postoffice.entity.Worry;
import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private WorryService worryService;

    public Response createResponse(Long worryId, Volunteer volunteer, String content) {
        Optional<Worry> worryOpt = worryService.getWorryById(worryId);
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

    public List<Response> getResponsesByVolunteerId(Long volunteerId) {
        return responseRepository.findByVolunteerId(volunteerId);
    }
} 