package com.sonu.email.assistance;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@CrossOrigin(
    origins = "*",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class EmailGeneratorController {

    private  final EmailGeneratorService emailGeneratorService;


    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest request) {
        String email = emailGeneratorService.generateEmailReply(request);
        return ResponseEntity.ok(email);
    }

}
