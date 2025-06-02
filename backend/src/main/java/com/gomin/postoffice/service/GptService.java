package com.gomin.postoffice.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class GptService {
    private final String apiKey;
    private final String model;
    private final List<String> bannedWords;
    private final OpenAiService openAiService;

    public GptService(@Value("${openai.api.key}") String apiKey,
                     @Value("${openai.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.openAiService = new OpenAiService(apiKey, Duration.ofSeconds(30));
        
        // 금지어 목록 초기화
        this.bannedWords = Arrays.asList(
            "욕설1", "욕설2", "욕설3",  // 실제 금지어로 교체 필요
            "광고", "홍보", "판매",
            "연락처", "전화번호", "이메일"
        );
    }

    public boolean reviewContent(String content) {
        // 1. 금지어 검사
        if (containsBannedWords(content)) {
            return false;
        }

        // 2. GPT 검토
        try {
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage("system", 
                "당신은 고민 상담 봉사자입니다. " +
                "다음 가이드라인에 따라 응답을 검토해주세요:\n" +
                "1. 부적절한 언어나 욕설이 없어야 합니다.\n" +
                "2. 광고나 홍보 내용이 없어야 합니다.\n" +
                "3. 개인정보를 요구하거나 공유하는 내용이 없어야 합니다.\n" +
                "4. 위로와 공감이 담긴 내용이어야 합니다.\n" +
                "5. 전문적인 조언이 아닌, 경험과 지혜를 나누는 방식이어야 합니다.\n" +
                "위 가이드라인에 모두 부합하면 'APPROVED', 하나라도 위반하면 'REJECTED'로 응답해주세요."
            ));
            messages.add(new ChatMessage("user", content));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .messages(messages)
                .build();

            String response = openAiService.createChatCompletion(request)
                .getChoices().get(0).getMessage().getContent();

            return response.trim().equals("APPROVED");
        } catch (Exception e) {
            // API 호출 실패 시 기본적으로 거부
            return false;
        }
    }

    private boolean containsBannedWords(String content) {
        String lowerContent = content.toLowerCase();
        return bannedWords.stream()
            .anyMatch(word -> lowerContent.contains(word.toLowerCase()));
    }
} 