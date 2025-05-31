package com.gomin.postoffice.service;

import com.gomin.postoffice.entity.Response;
import com.gomin.postoffice.entity.Volunteer;
import com.gomin.postoffice.entity.Worry;
import com.gomin.postoffice.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final WorryService worryService; // WorryService를 사용하여 고민 정보를 가져옴
    private final VolunteerService volunteerService; // VolunteerService를 사용하여 봉사자 정보를 가져옴

    @Autowired
    public ResponseService(ResponseRepository responseRepository,
                           WorryService worryService,
                           VolunteerService volunteerService) {
        this.responseRepository = responseRepository;
        this.worryService = worryService;
        this.volunteerService = volunteerService;
    }

    public Response saveResponse(Long worryId, Long volunteerId, String content) {
        Optional<Worry> optionalWorry = worryService.findById(worryId);
        Optional<Volunteer> optionalVolunteer = volunteerService.findById(volunteerId);

        if (optionalWorry.isPresent() && optionalVolunteer.isPresent()) {
            Worry worry = optionalWorry.get();
            Volunteer volunteer = optionalVolunteer.get();

            Response response = new Response();
            response.setWorry(worry);
            response.setVolunteer(volunteer);
            response.setContent(content);

            return responseRepository.save(response);
        } else {
            // 고민 또는 봉사자를 찾을 수 없을 경우 예외 처리 또는 null 반환
            throw new IllegalArgumentException("Worry or Volunteer not found");
        }
    }

    public List<Response> findByWorryId(Long worryId) {
        return responseRepository.findByWorryId(worryId);
    }

    public List<Response> findByVolunteerId(Long volunteerId) {
        return responseRepository.findByVolunteerId(volunteerId);
    }
} 