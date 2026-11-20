package com.snow.controller;

import com.snow.entity.LivenessCommand;
import com.snow.service.SnowDeploymentCommandHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health")
@Tag(name = "Health", description = "Health check endpoints")
public class HealthController {

    private static final Logger healthLog = LoggerFactory.getLogger("health-controller");

    private final SnowDeploymentCommandHandler snowDeploymentCommandHandler;

    public HealthController(SnowDeploymentCommandHandler snowDeploymentCommandHandler) {
        this.snowDeploymentCommandHandler = snowDeploymentCommandHandler;
    }

    @GetMapping(produces = MediaType.TEXT_PLAIN_VALUE)
    @Operation(summary = "Health check endpoint", description = "Returns the health status of the application")
    @ApiResponse(responseCode = "200", description = "Application is healthy")
    public ResponseEntity<String> hello() {
        healthLog.info("Health check endpoint called");
        healthLog.info("Returning health status: Healthy with HTTP 200");
        return ResponseEntity.ok("Healthy");
    }

    @PostMapping(value = "/liveness-status", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Update Liveness Status",
            description = "Updates `liveness_status` and optional `liveness_response` for deployments in `connectors.snow_deployments_anonymous` by `repository`."
    )
    @ApiResponse(responseCode = "200", description = "Liveness status updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request - repository or required fields missing")
    @ApiResponse(responseCode = "404", description = "Deployment not found for the provided repository")
    public ResponseEntity<String> updateLivenessStatus(@Valid @RequestBody LivenessCommand command) {
        String livenessStatus = "unhealthy".equals(command.getStatus()) ? "inactive" : "active";
        healthLog.info("Updating liveness status - repository: {}, mapped status: {}", command.getRepository(), livenessStatus);

        boolean success = snowDeploymentCommandHandler.updateDeploymentLivenessStatusAndResponseByRepository(
                command.getRepository(), livenessStatus, command.getResponse());

        if (!success) {
            healthLog.warn("Deployment not found for repository: {}", command.getRepository());
            return ResponseEntity.status(404)
                    .body("{\"error\": \"Deployment not found for repository: " + command.getRepository() + "\"}");
        }

        healthLog.info("Successfully updated liveness status for repository: {}", command.getRepository());
        return ResponseEntity.ok("{\"message\": \"Liveness status updated successfully\", \"repository\": \"" + command.getRepository() + "\", \"livenessStatus\": \"" + livenessStatus + "\"}");
    }
}
