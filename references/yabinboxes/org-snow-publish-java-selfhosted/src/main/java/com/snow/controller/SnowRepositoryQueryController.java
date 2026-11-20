package com.snow.controller;

import com.snow.entity.ProfileWithDeploymentsQuery;
import com.snow.service.SnowUrlQueryHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/connectors/get-snow-repository", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Snow Repository Queries", description = "Endpoints for resolving Snow deployment repositories")
public class SnowRepositoryQueryController {

    private static final Logger repositoryQueryControllerLog =
            LoggerFactory.getLogger("snow-repository-query-controller");

    private final SnowUrlQueryHandler snowUrlQueryHandler;

    public SnowRepositoryQueryController(SnowUrlQueryHandler snowUrlQueryHandler) {
        this.snowUrlQueryHandler = snowUrlQueryHandler;
    }

    @GetMapping
    @Operation(
            summary = "Get Repository by Snow Name",
            description = "Returns the deployment repository from snow_deployments_anonymous for the given snowName and optional gitType."
    )
    @ApiResponse(responseCode = "200", description = "Repository found or empty string when not found")
    @ApiResponse(responseCode = "400", description = "snowName parameter is required")
    public ResponseEntity<?> getRepositoryBySnowName(
            @Parameter(description = "The snowName of the deployment to look up", required = true)
            @RequestParam String snowName,
            @Parameter(description = "Optional gitType filter")
            @RequestParam(required = false) String gitType) {
        repositoryQueryControllerLog.info("Received repository lookup for snowName: {}, gitType: {}", snowName, gitType);

        if (snowName == null || snowName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "snowName parameter is required"));
        }

        String repository = snowUrlQueryHandler.getRepositoryBySnowName(snowName, gitType).orElse("");
        repositoryQueryControllerLog.info("Returning repository for snowName: {} -> {}", snowName, repository);
        return ResponseEntity.ok(Map.of("repository", repository));
    }

    @GetMapping("/all")
    @Operation(
            summary = "Get All Profiles With Deployments",
            description = "Returns all records from profile_owners and, for each profile, all records from snow_deployments_{profileId} when that table exists."
    )
    @ApiResponse(responseCode = "200", description = "List of profiles with their deployment records")
    public ResponseEntity<List<ProfileWithDeploymentsQuery>> getAllProfilesWithDeployments() {
        repositoryQueryControllerLog.info("Received request for all profile owners with deployments");
        List<ProfileWithDeploymentsQuery> profiles = snowUrlQueryHandler.getAllProfilesWithDeployments();
        repositoryQueryControllerLog.info("Returning {} profiles with deployments", profiles.size());
        return ResponseEntity.ok(profiles);
    }
}
