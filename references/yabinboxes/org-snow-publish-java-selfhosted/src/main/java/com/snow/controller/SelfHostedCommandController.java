package com.snow.controller;

import com.snow.entity.SelfHostedCommand;
import com.snow.service.SelfHostedHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/connectors/self-hosted")
@Tag(name = "Self Hosted Commands", description = "Update the single self_hosted setup row")
public class SelfHostedCommandController {

    private static final Logger selfHostedCommandLog = LoggerFactory.getLogger("self-hosted-command-controller");

    private final SelfHostedHandler selfHostedHandler;

    public SelfHostedCommandController(SelfHostedHandler selfHostedHandler) {
        this.selfHostedHandler = selfHostedHandler;
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Update the self_hosted row",
            description = "Updates fields present on the body of the single connectors.self_hosted row. Does not insert a row. Omitted fields stay unchanged."
    )
    @ApiResponse(responseCode = "200", description = "self_hosted row updated")
    @ApiResponse(responseCode = "400", description = "No fields to update")
    @ApiResponse(responseCode = "404", description = "self_hosted row not found")
    public ResponseEntity<?> updateSelfHosted(@RequestBody SelfHostedCommand command) {
        if (command == null || !command.hasChanges()) {
            selfHostedCommandLog.warn("self_hosted update rejected: no fields");
            return ResponseEntity.badRequest().body(Map.of("error", "At least one field is required"));
        }

        selfHostedCommandLog.info("Updating self_hosted");
        return selfHostedHandler.updateRecord(command)
                .<ResponseEntity<?>>map(record -> {
                    selfHostedCommandLog.info("Updated self_hosted id={}", record.getId());
                    return ResponseEntity.ok(record);
                })
                .orElseGet(this::missingRecord);
    }

    @PutMapping(value = "/first-time-flag", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Finish first-time setup",
            description = "Writes auth, baseUrl, clientId, redirectUri, and hostBaseUrl on the single connectors.self_hosted row and sets firstTimeFlag to 0. Does not insert a row."
    )
    @ApiResponse(responseCode = "200", description = "self_hosted row updated and firstTimeFlag set to 0")
    @ApiResponse(responseCode = "400", description = "auth, baseUrl, or hostBaseUrl is missing")
    @ApiResponse(responseCode = "404", description = "self_hosted row not found")
    public ResponseEntity<?> finishFirstTime(@RequestBody SelfHostedCommand command) {
        String error = validateFinish(command);
        if (error != null) {
            selfHostedCommandLog.warn("first-time-flag update rejected: {}", error);
            return ResponseEntity.badRequest().body(Map.of("error", error));
        }

        selfHostedCommandLog.info("Finishing first-time setup on self_hosted");
        return selfHostedHandler.finishFirstTime(command)
                .<ResponseEntity<?>>map(record -> {
                    selfHostedCommandLog.info("Updated self_hosted id={} firstTimeFlag={}", record.getId(), record.getFirstTimeFlag());
                    return ResponseEntity.ok(record);
                })
                .orElseGet(this::missingRecord);
    }

    private String validateFinish(SelfHostedCommand command) {
        if (command == null) {
            return "Request body is required";
        }
        String auth = command.getAuth() == null ? "" : command.getAuth().trim();
        if (!auth.equals("github") && !auth.equals("gitlab")) {
            return "auth must be github or gitlab";
        }
        if (command.getBaseUrl() == null || command.getBaseUrl().isBlank()) {
            return "baseUrl is required";
        }
        if (command.getHostBaseUrl() == null || command.getHostBaseUrl().isBlank()) {
            return "hostBaseUrl is required";
        }
        return null;
    }

    private ResponseEntity<Map<String, String>> missingRecord() {
        selfHostedCommandLog.warn("self_hosted record not found");
        return ResponseEntity.status(404).body(Map.of("error", "self_hosted record not found"));
    }
}
