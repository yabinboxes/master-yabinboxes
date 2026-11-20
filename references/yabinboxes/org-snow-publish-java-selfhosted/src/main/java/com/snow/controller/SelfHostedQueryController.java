package com.snow.controller;

import com.snow.service.SelfHostedHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/connectors/self-hosted")
@Tag(name = "Self Hosted", description = "Read the single self_hosted setup row")
public class SelfHostedQueryController {

    private static final Logger selfHostedQueryLog = LoggerFactory.getLogger("self-hosted-query-controller");

    private final SelfHostedHandler selfHostedHandler;

    public SelfHostedQueryController(SelfHostedHandler selfHostedHandler) {
        this.selfHostedHandler = selfHostedHandler;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Read the self_hosted row",
            description = "Returns the single connectors.self_hosted row."
    )
    @ApiResponse(responseCode = "200", description = "Single self_hosted row")
    @ApiResponse(responseCode = "404", description = "self_hosted row not found")
    public ResponseEntity<?> getSelfHosted() {
        selfHostedQueryLog.info("Reading self_hosted");
        return selfHostedHandler.getSingleRecord()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(this::missingRecord);
    }

    @GetMapping(value = "/first-time-flag", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Read firstTimeFlag",
            description = "Returns firstTimeFlag from the single connectors.self_hosted row."
    )
    @ApiResponse(responseCode = "200", description = "firstTimeFlag")
    @ApiResponse(responseCode = "404", description = "self_hosted row not found")
    public ResponseEntity<?> getFirstTimeFlag() {
        selfHostedQueryLog.info("Reading firstTimeFlag from self_hosted");
        return selfHostedHandler.getSingleRecord()
                .<ResponseEntity<?>>map(record -> ResponseEntity.ok(Map.of("firstTimeFlag", record.getFirstTimeFlag())))
                .orElseGet(this::missingRecord);
    }

    private ResponseEntity<Map<String, String>> missingRecord() {
        selfHostedQueryLog.warn("self_hosted record not found");
        return ResponseEntity.status(404).body(Map.of("error", "self_hosted record not found"));
    }
}
