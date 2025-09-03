package com.sonu.email.assistance;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder,
                                 @Value("${gemini.api.url}") String baseUrl,
                                 @Value("${gemini.api.key}") String geminiApiKey) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = geminiApiKey;
    }

    public String generateEmailReply(EmailRequest request) {

        // Build the Prompt
        String prompt = buildPrompt(request);

        //Prepare raw JSON body
        String requestBody = String.format("""
                {
                    "contents": [
                      {
                        "parts": [
                          {
                            "text": "%s"
                          }
                        ]
                      }
                    ]
                  }
                """,prompt);
        //Send Request
        String response = webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/v1beta/models/gemini-2.0-flash:generateContent").build())
                .header("X-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //Extract Response
        return extractResponse(response);

    }

    private String extractResponse(String response)  {

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root =mapper.readTree(response);
            return root.path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildPrompt(EmailRequest request) {
        StringBuilder prompt =new StringBuilder();
        prompt.append("Generate a professional email reply for the following email ");
        if(request.getTone()!=null && !request.getTone().isEmpty()){
            prompt.append("Use a ").append(request.getTone()).append(" tone. ");
        }
        prompt.append("Email Content: ").append(request.getEmailContent());
        return prompt.toString();
    }
}
