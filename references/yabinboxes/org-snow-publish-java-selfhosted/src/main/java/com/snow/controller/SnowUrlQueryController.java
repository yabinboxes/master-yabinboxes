package com.snow.controller;

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

import java.util.Map;

@RestController
@RequestMapping(value = "/connectors/get-snow-url", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Snow URL Queries", description = "Endpoints for resolving Snow deployment URLs")
public class SnowUrlQueryController {

    private static final Logger urlQueryControllerLog = LoggerFactory.getLogger("snow-url-query-controller");

    private final SnowUrlQueryHandler snowUrlQueryHandler;

    public SnowUrlQueryController(SnowUrlQueryHandler snowUrlQueryHandler) {
        this.snowUrlQueryHandler = snowUrlQueryHandler;
    }

    @GetMapping
    @Operation(
            summary = "Get URL by Snow Name",
            description = "Returns the deployment URL from snow_deployments_anonymous for the given snowName and optional gitType. Requires Authorization: Bearer with a snowTokenPipeline JWT."
    )
    @ApiResponse(responseCode = "200", description = "URL found")
    @ApiResponse(responseCode = "400", description = "snowName parameter is required")
    @ApiResponse(responseCode = "401", description = "Missing or invalid snowTokenPipeline Bearer token")
    public ResponseEntity<?> getUrlBySnowName(
            @Parameter(description = "The snowName of the deployment to look up", required = true)
            @RequestParam String snowName,
            @Parameter(description = "Optional gitType filter")
            @RequestParam(required = false) String gitType) {
        urlQueryControllerLog.info("Received url lookup request for snowName: {}, gitType: {}", snowName, gitType);

        if (snowName == null || snowName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "snowName parameter is required"));
        }

        String url = snowUrlQueryHandler.getUrlBySnowName(snowName, gitType).orElse("");
        urlQueryControllerLog.info("Returning url for snowName: {} -> {}", snowName, url);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
