package com.snow.controller;

import com.snow.entity.PublishSnowDeploymentCommand;
import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.service.SnowDeploymentCommandHandler;
import com.snow.utils.Type;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/connectors/publish-snow-deployment")
@Tag(name = "Snow Deployment Commands", description = "Endpoints for publishing and managing Snow deployment commands")
public class SnowDeploymentCommandController {

    private static final Logger commandControllerLog = LoggerFactory.getLogger("deployment-command-controller");

    private final SnowDeploymentCommandHandler snowDeploymentCommandHandler;

    public SnowDeploymentCommandController(SnowDeploymentCommandHandler snowDeploymentCommandHandler) {
        this.snowDeploymentCommandHandler = snowDeploymentCommandHandler;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    @Operation(
            summary = "Publish Snow Deployment Command",
            description = "Accepts a deployment command and adds it to the processing queue. Requires Authorization: Bearer with a snowTokenPipeline JWT (verified against profile_owners.snow_token). CORS allows all origins for this POST. The deployment will be processed asynchronously by scheduled tasks."
    )
    @ApiResponse(responseCode = "201", description = "Deployment command successfully created and added to queue")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "401", description = "Missing or invalid snowTokenPipeline Bearer token")
    @ApiResponse(responseCode = "500", description = "Internal server error - failed to add deployment command to queue")
    public ResponseEntity<String> resourceRequest(
            @RequestHeader(value = "Origin", required = false) String origin,
            @Valid @RequestBody PublishSnowDeploymentCommand command) {
        System.out.println("POST /connectors/publish-snow-deployment hit: snowName="
                + command.getSnowName()
                + ", snowType=" + command.getSnowType()
                + ", repository=" + command.getRepository()
                + ", actorId=" + command.getActorId()
                + ", origin=" + (origin != null ? origin : "<absent>"));
        commandControllerLog.info(
                "Received deployment command - origin: {}, snowName: {}, type: {}, repository: {}",
                origin != null ? origin : "<absent>",
                command.getSnowName(),
                command.getSnowType(),
                command.getRepository());

        Type deploymentType;
        try {
            deploymentType = Type.valueOf(command.getSnowType().toUpperCase());
        } catch (IllegalArgumentException e) {
            commandControllerLog.warn("Invalid snowType value: {}", command.getSnowType());
            return ResponseEntity.badRequest()
                    .body("Invalid snowType. Must be one of: CLUSTER, SERVICE, APPLICATION, WORKFLOW_CALL, REPOSITORY, RESOURCE");
        }

        if (Boolean.TRUE.equals(snowDeploymentCommandHandler.addSnowDeploymentToQueue(command, deploymentType))) {
            return ResponseEntity.status(201).body("completed");
        }

        commandControllerLog.error("Failed to add deployment command to queue");
        return ResponseEntity.internalServerError().body("error");
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Delete Snow Deployment by Repository",
            description = "Deletes the deployment row matching repository from snow_deployments_{profile_id}. Profile is resolved by actorId and optional gitType."
    )
    @ApiResponse(responseCode = "200", description = "Deployment record deleted")
    @ApiResponse(responseCode = "400", description = "repository or actorId parameter is required")
    @ApiResponse(responseCode = "404", description = "Profile or deployment not found")
    public ResponseEntity<?> deleteByRepository(
            @Parameter(description = "Repository key used to delete the deployment row", required = true)
            @RequestParam String repository,
            @Parameter(description = "Actor/user identifier used to resolve profileId", required = true)
            @RequestParam String actorId,
            @Parameter(description = "Optional gitType filter for profile lookup")
            @RequestParam(required = false) String gitType) {
        commandControllerLog.info(
                "Received delete deployment request - repository: {}, actorId: {}, gitType: {}",
                repository, actorId, gitType);

        if (repository == null || repository.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "repository parameter is required"));
        }
        if (actorId == null || actorId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "actorId parameter is required"));
        }

        Boolean success = snowDeploymentCommandHandler.deleteByRepository(repository, actorId, gitType);
        if (!Boolean.TRUE.equals(success)) {
            commandControllerLog.warn("Deployment not found for repository: {}", repository);
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Deployment not found for repository: " + repository));
        }

        commandControllerLog.info("Successfully deleted deployment for repository: {}", repository);
        return ResponseEntity.ok(Map.of("message", "Deployment deleted successfully", "repository", repository));
    }

    @GetMapping(value = "/table-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get All Data by Table Name",
            description = "Returns all rows from a snow deployments table. Allowed values: snow_deployments_anonymous or snow_deployments_{profile_id} (e.g. snow_deployments_3)."
    )
    @ApiResponse(responseCode = "200", description = "All deployment records from the table")
    @ApiResponse(responseCode = "400", description = "tableName is missing or invalid")
    public ResponseEntity<List<SnowDeploymentsAnonymous>> getAllByTableName(
            @Parameter(description = "Table name, e.g. snow_deployments_anonymous or snow_deployments_3", required = true)
            @RequestParam String tableName) {
        commandControllerLog.info("Received request to read all data from table: {}", tableName);

        if (tableName == null || tableName.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<SnowDeploymentsAnonymous> records = snowDeploymentCommandHandler.getAllByTableName(tableName);
        if (records == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(records);
    }

    @DeleteMapping(value = "/truncate", produces = MediaType.TEXT_PLAIN_VALUE)
    @Operation(
            summary = "Truncate Anonymous Deployments Table",
            description = "Truncates the snow_deployments_anonymous table, removing all records and resetting the identity sequence."
    )
    public ResponseEntity<String> truncateAnonymousTable() {
        commandControllerLog.info("Received request to truncate snow_deployments_anonymous table");
        try {
            snowDeploymentCommandHandler.truncateTables();
            commandControllerLog.info("Successfully truncated snow_deployments_anonymous table");
            return ResponseEntity.ok("Table truncated successfully");
        } catch (Exception e) {
            commandControllerLog.error("Failed to truncate snow_deployments_anonymous table: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("error");
        }
    }

    @PutMapping(value = "/color/{snowDeploymentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Update Deployment Color", description = "Updates the color field for a specific deployment by deployment ID.")
    public ResponseEntity<String> updateDeploymentColor(
            @PathVariable("snowDeploymentId") Long snowDeploymentId,
            @RequestParam("color") String color) {
        commandControllerLog.info("Received request to update deployment color - ID: {}, Color: {}", snowDeploymentId, color);

        if (color == null || color.isEmpty()) {
            commandControllerLog.warn("Color parameter is missing");
            return ResponseEntity.badRequest().body("{\"error\": \"Color parameter is required\"}");
        }

        Boolean success = snowDeploymentCommandHandler.updateDeploymentColor(snowDeploymentId, color);
        if (!Boolean.TRUE.equals(success)) {
            commandControllerLog.warn("Deployment not found for ID: {}", snowDeploymentId);
            return ResponseEntity.status(404).body("{\"error\": \"Deployment not found for ID: " + snowDeploymentId + "\"}");
        }

        commandControllerLog.info("Successfully updated color for deployment ID: {}", snowDeploymentId);
        return ResponseEntity.ok("{\"message\": \"Color updated successfully\", \"snowDeploymentId\": " + snowDeploymentId + ", \"color\": \"" + color + "\"}");
    }

    @PutMapping(value = "/liveness-type/{snowDeploymentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create or Update Liveness Type", description = "Sets or updates the liveness type for a specific deployment by deployment ID.")
    public ResponseEntity<String> createOrUpdateLivenessType(
            @PathVariable("snowDeploymentId") Long snowDeploymentId,
            @RequestParam("livenessType") String livenessType) {
        commandControllerLog.info("Received request to create or update deployment liveness type - ID: {}, Type: {}", snowDeploymentId, livenessType);

        if (livenessType == null || livenessType.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Liveness type parameter is required\"}");
        }

        Boolean success = snowDeploymentCommandHandler.updateDeploymentLivenessType(snowDeploymentId, livenessType);
        if (!Boolean.TRUE.equals(success)) {
            return ResponseEntity.status(404).body("{\"error\": \"Deployment not found for ID: " + snowDeploymentId + "\"}");
        }

        return ResponseEntity.ok("{\"message\": \"Liveness type updated successfully\", \"snowDeploymentId\": " + snowDeploymentId + ", \"livenessType\": \"" + livenessType + "\"}");
    }

    @DeleteMapping(value = "/liveness-type/{snowDeploymentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Delete Liveness Type", description = "Clears the liveness type for a specific deployment by deployment ID.")
    public ResponseEntity<String> deleteLivenessType(@PathVariable("snowDeploymentId") Long snowDeploymentId) {
        Boolean success = snowDeploymentCommandHandler.deleteDeploymentLivenessType(snowDeploymentId);
        if (!Boolean.TRUE.equals(success)) {
            return ResponseEntity.status(404).body("{\"error\": \"Deployment not found for ID: " + snowDeploymentId + "\"}");
        }
        return ResponseEntity.ok("{\"message\": \"Liveness type deleted successfully\", \"snowDeploymentId\": " + snowDeploymentId + "}");
    }

    @PutMapping(value = "/liveness-status/{snowDeploymentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create or Update Liveness Status", description = "Sets or updates the liveness status for a specific deployment by deployment ID.")
    public ResponseEntity<String> createOrUpdateLivenessStatus(
            @PathVariable("snowDeploymentId") Long snowDeploymentId,
            @RequestParam("livenessStatus") String livenessStatus) {
        if (livenessStatus == null || livenessStatus.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Liveness status parameter is required\"}");
        }

        Boolean success = snowDeploymentCommandHandler.updateDeploymentLivenessStatus(snowDeploymentId, livenessStatus);
        if (!Boolean.TRUE.equals(success)) {
            return ResponseEntity.status(404).body("{\"error\": \"Deployment not found for ID: " + snowDeploymentId + "\"}");
        }

        return ResponseEntity.ok("{\"message\": \"Liveness status updated successfully\", \"snowDeploymentId\": " + snowDeploymentId + ", \"livenessStatus\": \"" + livenessStatus + "\"}");
    }

    @DeleteMapping(value = "/liveness-status/{snowDeploymentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Delete Liveness Status", description = "Clears the liveness status for a specific deployment by deployment ID.")
    public ResponseEntity<String> deleteLivenessStatus(@PathVariable("snowDeploymentId") Long snowDeploymentId) {
        Boolean success = snowDeploymentCommandHandler.deleteDeploymentLivenessStatus(snowDeploymentId);
        if (!Boolean.TRUE.equals(success)) {
            return ResponseEntity.status(404).body("{\"error\": \"Deployment not found for ID: " + snowDeploymentId + "\"}");
        }
        return ResponseEntity.ok("{\"message\": \"Liveness status deleted successfully\", \"snowDeploymentId\": " + snowDeploymentId + "}");
    }
}
