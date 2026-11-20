package com.snow.controller;

import com.snow.entity.ProfileQuery;
import com.snow.service.ProfileCommandHandler;
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

@RestController
@RequestMapping("/connectors/profile")
@Tag(name = "Profile Management", description = "Endpoints for managing user profiles and profile information")
public class ProfileController {

    private static final Logger profileControllerLog = LoggerFactory.getLogger("profile-controller");

    private final ProfileCommandHandler profileCommandHandler;

    public ProfileController(ProfileCommandHandler profileCommandHandler) {
        this.profileCommandHandler = profileCommandHandler;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get or Create Profile",
            description = "Retrieves an existing profile by email or creates a new profile if it doesn't exist."
    )
    public ResponseEntity<ProfileQuery> getProfile(@Valid @RequestBody ProfileQuery profileQuery) {
        profileControllerLog.info("Received profile request for email: {}", profileQuery.getEmail());
        ProfileQuery profile = profileCommandHandler.getProfile(profileQuery);
        profileControllerLog.info("Returning profile with HTTP 200 for email: {}", profile.getEmail());
        return ResponseEntity.ok(profile);
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Modify Profile", description = "Updates an existing profile by email.")
    public ResponseEntity<?> modifyProfile(@Valid @RequestBody ProfileQuery profileQuery) {
        profileControllerLog.info("Received modify profile request for email: {}", profileQuery.getEmail());
        ProfileQuery updatedProfile = profileCommandHandler.modifyProfile(profileQuery);
        if (updatedProfile == null) {
            return ResponseEntity.status(404)
                    .body("{\"error\": \"Profile not found for email: " + profileQuery.getEmail() + "\"}");
        }
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping(value = "/snow-token-pipeline", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get Snow Token Pipeline",
            description = "Retrieves the snowTokenPipeline for a profile resolved by actorId and optional gitType."
    )
    public ResponseEntity<String> getSnowTokenPipeline(
            @Parameter(description = "Actor/user identifier used to resolve profile", required = true)
            @RequestParam String actorId,
            @Parameter(description = "Optional gitType filter for profile lookup")
            @RequestParam(required = false) String gitType) {
        if (actorId == null || actorId.isBlank()) {
            return ResponseEntity.badRequest().body("{\"error\": \"actorId parameter is required\"}");
        }

        profileControllerLog.info("Received get snowTokenPipeline for actorId: {}, gitType: {}", actorId, gitType);
        String snowTokenPipeline = profileCommandHandler.getSnowTokenPipeline(actorId, gitType);
        if (snowTokenPipeline == null) {
            return ResponseEntity.status(404)
                    .body("{\"error\": \"Profile not found for actorId: " + actorId + "\"}");
        }

        return ResponseEntity.ok("{\"snowTokenPipeline\": \"" + snowTokenPipeline + "\"}");
    }

    @PutMapping(value = "/snow-token-pipeline", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Regenerate Snow Token Pipeline",
            description = "Regenerates and returns a new snowTokenPipeline for a profile resolved by actorId and optional gitType."
    )
    public ResponseEntity<String> regenerateSnowTokenPipeline(
            @Parameter(description = "Actor/user identifier used to resolve profile", required = true)
            @RequestParam String actorId,
            @Parameter(description = "Optional gitType filter for profile lookup")
            @RequestParam(required = false) String gitType) {
        if (actorId == null || actorId.isBlank()) {
            return ResponseEntity.badRequest().body("{\"error\": \"actorId parameter is required\"}");
        }

        profileControllerLog.info("Received regenerate snowTokenPipeline for actorId: {}, gitType: {}", actorId, gitType);
        String newSnowTokenPipeline = profileCommandHandler.regenerateSnowTokenPipeline(actorId, gitType);
        if (newSnowTokenPipeline == null) {
            return ResponseEntity.status(404)
                    .body("{\"error\": \"Profile not found for actorId: " + actorId + "\"}");
        }

        return ResponseEntity.ok("{\"snowTokenPipeline\": \"" + newSnowTokenPipeline + "\"}");
    }

    @PutMapping(value = "/license", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Update Profile License", description = "Updates the license property for a profile by email address.")
    public ResponseEntity<?> updateLicense(@Valid @RequestBody ProfileQuery profileQuery) {
        if (profileQuery.getEmail() == null || profileQuery.getEmail().isEmpty()
                || profileQuery.getLicense() == null || profileQuery.getLicense().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email and license are required\"}");
        }

        ProfileQuery updatedProfile = profileCommandHandler.modifyProfile(profileQuery);
        if (updatedProfile == null) {
            return ResponseEntity.status(404)
                    .body("{\"error\": \"Profile not found for email: " + profileQuery.getEmail() + "\"}");
        }
        return ResponseEntity.ok(updatedProfile);
    }
}
